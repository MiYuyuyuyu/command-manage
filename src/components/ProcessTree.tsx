import { useState, useEffect, useCallback } from 'react';
import type { ProcessTreeNode } from '../types';
import { getStatusLabel, getStatusClass, formatMemory } from '../utils';

interface ProcessTreeProps {
  loadTree: () => Promise<ProcessTreeNode[]>;
  onKill: (pid: number) => void;
}

function ProcessTree({ loadTree, onKill }: ProcessTreeProps) {
  const [tree, setTree] = useState<ProcessTreeNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedPids, setExpandedPids] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    const result = await loadTree();
    setTree(result);
    setLoading(false);
  }, [loadTree]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const toggleExpand = (pid: number) => {
    setExpandedPids((prev) => {
      const next = new Set(prev);
      if (next.has(pid)) {
        next.delete(pid);
      } else {
        next.add(pid);
      }
      return next;
    });
  };

  const expandAll = () => {
    const allPids = new Set<number>();
    const collect = (nodes: ProcessTreeNode[]) => {
      for (const n of nodes) {
        if (n.children.length > 0) allPids.add(n.process.pid);
        collect(n.children);
      }
    };
    collect(tree);
    setExpandedPids(allPids);
  };

  const collapseAll = () => setExpandedPids(new Set());

  const matchesSearch = (node: ProcessTreeNode): boolean => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    if (
      node.process.name.toLowerCase().includes(term) ||
      node.process.pid.toString().includes(term)
    ) return true;
    return node.children.some(matchesSearch);
  };

  const renderNode = (node: ProcessTreeNode, depth: number = 0): React.JSX.Element | null => {
    if (!matchesSearch(node)) return null;
    const hasChildren = node.children.length > 0;
    const isExpanded = expandedPids.has(node.process.pid);

    return (
      <div key={node.process.pid}>
        <div
          className="tree-row"
          style={{ paddingLeft: `${depth * 24 + 12}px` }}
        >
          <button
            className={`tree-toggle ${hasChildren ? '' : 'invisible'}`}
            onClick={() => toggleExpand(node.process.pid)}
          >
            {isExpanded ? '▼' : '▶'}
          </button>
          <span className="tree-name">{node.process.name}</span>
          <span className="tree-pid">{node.process.pid}</span>
          <span className={`badge badge-sm badge-${getStatusClass(node.process.status)}`}>
            {getStatusLabel(node.process.status)}
          </span>
          <span className="tree-mem">{formatMemory(node.process.memory)}</span>
          <button
            className="btn btn-xs btn-danger"
            onClick={() => onKill(node.process.pid)}
          >
            终止
          </button>
        </div>
        {hasChildren && isExpanded && (
          <div className="tree-children">
            {node.children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="tree-panel">
      <div className="tree-toolbar">
        <div className="search-box">
          <span className="search-icon">&#128269;</span>
          <input
            type="text"
            className="input"
            placeholder="搜索进程树..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="tree-actions">
          <button className="btn btn-ghost btn-sm" onClick={expandAll}>全部展开</button>
          <button className="btn btn-ghost btn-sm" onClick={collapseAll}>全部折叠</button>
          <button className="btn btn-primary btn-sm" onClick={refresh} disabled={loading}>
            {loading ? '加载中...' : '刷新'}
          </button>
        </div>
      </div>
      <div className="tree-content">
        {tree.map((node) => renderNode(node))}
      </div>
    </div>
  );
}

export default ProcessTree;
