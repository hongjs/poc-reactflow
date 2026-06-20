// RepeatModeTests.swift
// Cosmos Music Player Tests

import XCTest
@testable import Cosmos_Music_Player

final class RepeatModeTests: XCTestCase {

    // MARK: - RepeatMode enum

    func testRawValues() {
        XCTAssertEqual(PlayerEngine.RepeatMode.none.rawValue,      "none")
        XCTAssertEqual(PlayerEngine.RepeatMode.repeatAll.rawValue, "repeatAll")
        XCTAssertEqual(PlayerEngine.RepeatMode.repeatOne.rawValue, "repeatOne")
    }

    func testInitFromRawValue() {
        XCTAssertEqual(PlayerEngine.RepeatMode(rawValue: "none"),      .none)
        XCTAssertEqual(PlayerEngine.RepeatMode(rawValue: "repeatAll"), .repeatAll)
        XCTAssertEqual(PlayerEngine.RepeatMode(rawValue: "repeatOne"), .repeatOne)
        XCTAssertNil(PlayerEngine.RepeatMode(rawValue: "invalid"))
        XCTAssertNil(PlayerEngine.RepeatMode(rawValue: ""))
    }

    func testAllCasesCount() {
        XCTAssertEqual(PlayerEngine.RepeatMode.allCases.count, 3)
    }

    // MARK: - cycleLoopMode() state progression

    @MainActor
    func testCycleNoneToRepeatAll() {
        let engine = PlayerEngine.shared
        engine.repeatMode = .none
        engine.cycleLoopMode()
        XCTAssertEqual(engine.repeatMode, .repeatAll)
    }

    @MainActor
    func testCycleRepeatAllToRepeatOne() {
        let engine = PlayerEngine.shared
        engine.repeatMode = .repeatAll
        engine.cycleLoopMode()
        XCTAssertEqual(engine.repeatMode, .repeatOne)
    }

    @MainActor
    func testCycleRepeatOneToNone() {
        let engine = PlayerEngine.shared
        engine.repeatMode = .repeatOne
        engine.cycleLoopMode()
        XCTAssertEqual(engine.repeatMode, .none)
    }

    @MainActor
    func testFullCycleReturnsToNone() {
        let engine = PlayerEngine.shared
        engine.repeatMode = .none

        engine.cycleLoopMode()
        XCTAssertEqual(engine.repeatMode, .repeatAll,  "1st tap: none → repeatAll")

        engine.cycleLoopMode()
        XCTAssertEqual(engine.repeatMode, .repeatOne,  "2nd tap: repeatAll → repeatOne")

        engine.cycleLoopMode()
        XCTAssertEqual(engine.repeatMode, .none,       "3rd tap: repeatOne → none")
    }

    // MARK: - decodeRepeatMode — new key

    func testDecodeNewRepeatModeKeyNone() {
        let dict: [String: Any] = ["repeatMode": "none"]
        XCTAssertEqual(PlayerEngine.decodeRepeatMode(from: dict), .none)
    }

    func testDecodeNewRepeatModeKeyRepeatAll() {
        let dict: [String: Any] = ["repeatMode": "repeatAll"]
        XCTAssertEqual(PlayerEngine.decodeRepeatMode(from: dict), .repeatAll)
    }

    func testDecodeNewRepeatModeKeyRepeatOne() {
        let dict: [String: Any] = ["repeatMode": "repeatOne"]
        XCTAssertEqual(PlayerEngine.decodeRepeatMode(from: dict), .repeatOne)
    }

    func testDecodeNewKeyTakesPrecedenceOverLegacy() {
        // New key says repeatAll, legacy booleans say repeatOne – new key wins.
        let dict: [String: Any] = ["repeatMode": "repeatAll", "isLoopingSong": true]
        XCTAssertEqual(PlayerEngine.decodeRepeatMode(from: dict), .repeatAll)
    }

    // MARK: - decodeRepeatMode — legacy migration

    func testDecodeLegacyIsRepeatingTrue() {
        let dict: [String: Any] = ["isRepeating": true, "isLoopingSong": false]
        XCTAssertEqual(PlayerEngine.decodeRepeatMode(from: dict), .repeatAll)
    }

    func testDecodeLegacyIsLoopingSongTrue() {
        let dict: [String: Any] = ["isRepeating": false, "isLoopingSong": true]
        XCTAssertEqual(PlayerEngine.decodeRepeatMode(from: dict), .repeatOne)
    }

    func testDecodeLegacyBothFalseGivesNone() {
        let dict: [String: Any] = ["isRepeating": false, "isLoopingSong": false]
        XCTAssertEqual(PlayerEngine.decodeRepeatMode(from: dict), .none)
    }

    func testDecodeEmptyDictGivesNone() {
        XCTAssertEqual(PlayerEngine.decodeRepeatMode(from: [:]), .none)
    }

    func testDecodeInvalidRawValueFallsBackToLegacy() {
        // Unknown rawValue + isRepeating:true → should fall back to .repeatAll
        let dict: [String: Any] = ["repeatMode": "garbage", "isRepeating": true]
        XCTAssertEqual(PlayerEngine.decodeRepeatMode(from: dict), .repeatAll)
    }

    // MARK: - StateManager.PlayerState Codable migration

    func testPlayerStateDecodesNewRepeatModeField() throws {
        let json = """
        {
            "currentTrackStableId": "track-1",
            "playbackTime": 10.0,
            "isPlaying": false,
            "queueTrackIds": [],
            "currentIndex": 0,
            "repeatMode": "repeatOne",
            "isShuffled": false,
            "originalQueueTrackIds": [],
            "lastSavedAt": "2025-01-01T00:00:00Z"
        }
        """.data(using: .utf8)!

        let state = try makeDecoder().decode(PlayerState.self, from: json)
        XCTAssertEqual(state.repeatMode, "repeatOne")
        XCTAssertNil(state.isRepeating)
        XCTAssertNil(state.isLoopingSong)
    }

    func testPlayerStateMigratesLegacyRepeatAllBooleans() throws {
        let json = legacyJSON(isRepeating: true, isLoopingSong: false)
        let state = try makeDecoder().decode(PlayerState.self, from: json)
        XCTAssertEqual(state.repeatMode, "repeatAll",
                       "isRepeating:true should migrate to repeatAll")
    }

    func testPlayerStateMigratesLegacyRepeatOneBooleans() throws {
        let json = legacyJSON(isRepeating: false, isLoopingSong: true)
        let state = try makeDecoder().decode(PlayerState.self, from: json)
        XCTAssertEqual(state.repeatMode, "repeatOne",
                       "isLoopingSong:true should migrate to repeatOne")
    }

    func testPlayerStateMigratesLegacyBothFalseToNone() throws {
        let json = legacyJSON(isRepeating: false, isLoopingSong: false)
        let state = try makeDecoder().decode(PlayerState.self, from: json)
        XCTAssertEqual(state.repeatMode, "none",
                       "Both false should remain none")
    }

    func testPlayerStateNewKeyTakesPriorityOverLegacy() throws {
        // JSON has both new key and legacy keys; new key must win.
        let json = """
        {
            "currentTrackStableId": "t",
            "playbackTime": 0,
            "isPlaying": false,
            "queueTrackIds": [],
            "currentIndex": 0,
            "repeatMode": "repeatAll",
            "isRepeating": false,
            "isLoopingSong": true,
            "isShuffled": false,
            "originalQueueTrackIds": [],
            "lastSavedAt": "2025-01-01T00:00:00Z"
        }
        """.data(using: .utf8)!

        let state = try makeDecoder().decode(PlayerState.self, from: json)
        XCTAssertEqual(state.repeatMode, "repeatAll")
    }

    // MARK: - Helpers

    private func makeDecoder() -> JSONDecoder {
        let d = JSONDecoder()
        d.dateDecodingStrategy = .iso8601
        return d
    }

    private func legacyJSON(isRepeating: Bool, isLoopingSong: Bool) -> Data {
        """
        {
            "currentTrackStableId": "track-1",
            "playbackTime": 0.0,
            "isPlaying": false,
            "queueTrackIds": [],
            "currentIndex": 0,
            "isRepeating": \(isRepeating),
            "isLoopingSong": \(isLoopingSong),
            "isShuffled": false,
            "originalQueueTrackIds": [],
            "lastSavedAt": "2025-01-01T00:00:00Z"
        }
        """.data(using: .utf8)!
    }
}
