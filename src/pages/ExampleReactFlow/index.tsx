'use client';
import { Panel, Sidebar } from '@/components';
import { elkOptions, initialEdges, initialNodes, nodeTypes } from '@/configs/constants';
import { faker } from '@faker-js/faker';
import ELK, { ElkNode, LayoutOptions } from 'elkjs/lib/elk.bundled.js';
import { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  Controls,
  MarkerType,
  MiniMap,
  PanOnScrollMode,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow
} from 'reactflow';
import 'reactflow/dist/style.css';

const elk = new ELK();

export interface NodeData {
  name: string;
  title: string;
  photo: string;
  expanded?: boolean
  onDataChanged: (id: string, data: NodeData) => void,
}

const DnDFlow = () => {
  const { fitView } = useReactFlow();
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const getLayoutedElements = (nodes: any, edges: any, options: LayoutOptions = {}) => {
    const isHorizontal = options?.['elk.direction'] === 'RIGHT';
    const graph: ElkNode = {
      id: 'root',
      layoutOptions: options,
      children: nodes.map((node: any) => ({
        ...node,
        // Adjust the target and source handle positions based on the layout
        // direction.
        targetPosition: isHorizontal ? 'left' : 'top',
        sourcePosition: isHorizontal ? 'right' : 'bottom',

        // Hardcode a width and height for elk to use when layouting.
        width: 150,
        height: 100
      })),
      edges: edges
    };

    return elk
      .layout(graph)
      .then((layoutedGraph) => ({
        nodes: layoutedGraph?.children?.map((node) => ({
          ...node,
          // React Flow expects a position property on the node instead of `x`
          // and `y` fields.
          position: { x: node.x, y: node.y }
        })),
        edges: layoutedGraph.edges
      }))
      .catch((error) => console.error('ERROR:', error));
  };

  const onLayout = useCallback(
    (direction: string, useInitialNodes: boolean) => {
      const opts: LayoutOptions = { 'elk.direction': direction, ...elkOptions };

      const ns = useInitialNodes ? initialNodes : nodes;
      const es = useInitialNodes ? initialEdges : edges;

      getLayoutedElements(ns, es, opts).then((res: any) => {
        if (res) {
          const { nodes: layoutedNodes, edges: layoutedEdges } = res;
          setNodes(layoutedNodes);
          setEdges(layoutedEdges);
        }

        window.requestAnimationFrame(() => fitView());
      });
    },
    [nodes, edges]
  );

  const onConnect = useCallback(
    (params: any) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            style: { stroke: '#21CE99' },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: '#21CE99'
            }
          },
          eds
        )
      ),
    []
  );

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDataChanged = useCallback((id: string, data: NodeData) => {

    setNodes((nds) => nds.map((nd) => nd.id === id ? { ...nd, data } : nd));
  }, []);


  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY
      });
      const newNode = {
        id: faker.string.uuid(),
        type,
        position,
        data: {
          name: faker.person.fullName(),
          title: faker.person.jobArea(),
          photo: faker.image.urlLoremFlickr(),
          onDataChanged: handleDataChanged,
        } as NodeData,
        style: { border: '1px solid #777', padding: 10, width: '200px' }
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      console.log(JSON.stringify(flow));
    }
  }, [reactFlowInstance]);

  return (
    <div className="dndflow">
      <div
        className="reactflow-wrapper"
        ref={reactFlowWrapper}
        style={{ backgroundColor: '#efefef', width: '100%', height: '950px' }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          panOnScroll={true}
          panOnScrollMode={PanOnScrollMode.Free}
          fitView
        >
          <Controls />
        </ReactFlow>
      </div>
      <MiniMap />
      <Sidebar />
      <Panel onSave={onSave} onLayout={onLayout} />
    </div>
  );
};

export default DnDFlow;
