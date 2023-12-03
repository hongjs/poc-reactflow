'use client';
import { ConnectionLine, Panel, Sidebar } from '@/components';
import { edgeTypes, elkOptions, initialEdges, initialNodes, nodeTypes, } from '@/configs/constants';
import { faker } from '@faker-js/faker';
import ELK, { ElkExtendedEdge, ElkNode, LayoutOptions } from 'elkjs/lib/elk.bundled.js';
import { DragEventHandler, useCallback, useRef, useState } from 'react';
import ReactFlow, {
  Connection,
  Controls,
  Edge,
  MarkerType,
  MiniMap,
  OnConnect,
  PanOnScrollMode,
  ReactFlowInstance,
  addEdge,
  getOutgoers,
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
  percentage?: number
  onDataChanged: (id: string, data: NodeData) => void,
}

export interface EdgeData {

}

const DnDFlow = () => {
  const { fitView, getNodes, getEdges, } = useReactFlow();
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance<NodeData, EdgeData> | null>(null);

  const getLayoutedElements = (nodes: Node[], edges: Edge[], options: LayoutOptions = {}) => {
    const isHorizontal = options?.['elk.direction'] === 'RIGHT';
    const graph: ElkNode = {
      id: 'root',
      layoutOptions: options,
      children: nodes.map((node: Node) => ({
        ...node,
        // Adjust the target and source handle positions based on the layout
        // direction.
        targetPosition: isHorizontal ? 'left' : 'top',
        sourcePosition: isHorizontal ? 'right' : 'bottom',

        // Hardcode a width and height for elk to use when layouting.
        width: 150,
        height: 100
      })) as unknown as ElkExtendedEdge[],
      edges: edges as unknown as ElkExtendedEdge[]
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
      const options: LayoutOptions = { 'elk.direction': direction, ...elkOptions };
      const ns = (useInitialNodes ? initialNodes : nodes) as Node[];
      const es = (useInitialNodes ? initialEdges : edges) as Edge[];

      getLayoutedElements(ns, es, options).then((res: any) => {
        if (res) {
          setNodes(res.nodes);
          setEdges(res.edges);
        }
        window.requestAnimationFrame(() => fitView());
      });
    },
    [nodes, edges]
  );

  const onConnect: OnConnect = useCallback(
    (connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            type: 'number',
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

  const onDragOver: DragEventHandler<HTMLDivElement> = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDataChanged = useCallback((id: string, data: NodeData) => {
    setNodes((nds) => {
      return nds.map((nd) => nd.id === id ? { ...nd, data } : nd)
    });
  }, []);


  const onDrop: DragEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      event.preventDefault();
      if (!reactFlowInstance) return;

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
          percentage: faker.number.int({ min: 0, max: 100 })
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

  const isValidConnection = useCallback(
    (connection: Connection): boolean => {
      // we are using getNodes and getEdges helpers here
      // to make sure we create isValidConnection function only once
      const nodes = getNodes();
      const edges = getEdges();
      const target = nodes.find((node) => node.id === connection.target);
      const hasCycle = (node: any, visited = new Set()) => {
        if (visited.has(node.id)) return false;

        visited.add(node.id);

        for (const outgoer of getOutgoers(node, nodes, edges)) {
          if (outgoer.id === connection.source) return true;
          if (hasCycle(outgoer, visited)) return true;
        }
      };

      if (target?.id === connection.source) return false;
      return !hasCycle(target);
    },
    [getNodes, getEdges],
  );

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
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          isValidConnection={isValidConnection}
          panOnScroll={true}
          panOnScrollMode={PanOnScrollMode.Free}
          connectionLineComponent={ConnectionLine}
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
