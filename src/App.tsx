import { useState } from 'react';
import { useProcessData } from './hooks/useProcessData';
import Header from './components/Header';
import SpawnForm from './components/SpawnForm';
import ProcessTable from './components/ProcessTable';
import ProcessDetail from './components/ProcessDetail';
import ProcessTree from './components/ProcessTree';
import SystemInfoPanel from './components/SystemInfoPanel';
import type { TabType, ProcessInfo } from './types';
import './styles/global.css';

function App() {
  const {
    processes,
    systemInfo,
    lastUpdate,
    error,
    killProcess,
    setPriority,
    loadProcessTree,
    clearError,
  } = useProcessData();

  const [activeTab, setActiveTab] = useState<TabType>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProcess, setSelectedProcess] = useState<ProcessInfo | null>(null);

  return (
    <div className="app">
      <Header
        systemInfo={systemInfo}
        lastUpdate={lastUpdate}
        processCount={processes.length}
      />

      <nav className="tab-bar">
        <button
          className={`tab ${activeTab === 'list' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('list')}
        >
          进程列表
        </button>
        <button
          className={`tab ${activeTab === 'tree' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('tree')}
        >
          进程树
        </button>
        <button
          className={`tab ${activeTab === 'system' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('system')}
        >
          系统信息
        </button>
      </nav>

      {error && (
        <div className="error-bar">
          <span>{error}</span>
          <button className="btn-close-sm" onClick={clearError}>&#10005;</button>
        </div>
      )}

      <main className="content">
        {activeTab === 'list' && (
          <>
            <div className="list-toolbar">
              <div className="search-box">
                <span className="search-icon">&#128269;</span>
                <input
                  type="text"
                  className="input"
                  placeholder="搜索进程名称、PID 或路径..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button className="btn-clear" onClick={() => setSearchTerm('')}>&#10005;</button>
                )}
              </div>
              <SpawnForm />
            </div>
            <ProcessTable
              processes={processes}
              searchTerm={searchTerm}
              onKill={killProcess}
              onPriorityUp={(pid) => setPriority(pid, 10)}
              onPriorityDown={(pid) => setPriority(pid, -10)}
              onSelect={setSelectedProcess}
            />
          </>
        )}

        {activeTab === 'tree' && (
          <ProcessTree loadTree={loadProcessTree} onKill={killProcess} />
        )}

        {activeTab === 'system' && (
          <SystemInfoPanel systemInfo={systemInfo} />
        )}
      </main>

      {selectedProcess && (
        <ProcessDetail
          process={selectedProcess}
          onClose={() => setSelectedProcess(null)}
          onKill={(pid) => {
            killProcess(pid);
            setSelectedProcess(null);
          }}
        />
      )}
    </div>
  );
}

export default App;
