
import React, { useState, useCallback, useEffect } from 'react';
import { AppState, ProcessingResult } from './types';
import { processSelector, fetchUrlSimulated } from './geminiService';
import CheatSheet from './components/CheatSheet';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    url: 'https://example.com',
    html: `<!DOCTYPE html>
<html>
<head><title>Test Page</title></head>
<body>
  <div id="container" class="main-wrapper">
    <h1 class="title">Welcome to Drission Playground</h1>
    <p>This is a sample page to test your selectors.</p>
    <ul class="items">
      <li id="item-1">First Item</li>
      <li id="item-2" class="active">Second Item (Active)</li>
      <li id="item-3">Third Item</li>
    </ul>
    <button id="login-btn" class="btn btn-primary">Login Now</button>
    <a href="/help" class="link">Get Help</a>
  </div>
  <footer>© 2024 DrissionPage</footer>
</body>
</html>`,
    selector: '@id=container',
    result: null,
    isLoading: false,
    activeTab: 'source'
  });

  const handleFetch = async () => {
    if (!state.url) return;
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const fetchedHtml = await fetchUrlSimulated(state.url);
      setState(prev => ({ ...prev, html: fetchedHtml, isLoading: false }));
    } catch (e) {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleRunSelector = useCallback(async () => {
    if (!state.selector || !state.html) return;
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const result = await processSelector(state.html, state.selector);
      setState(prev => ({ ...prev, result, isLoading: false }));
    } catch (e) {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [state.html, state.selector]);

  // Initial run
  useEffect(() => {
    handleRunSelector();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden">
      {/* Header */}
      <header className="bg-slate-900 text-white p-4 flex items-center justify-between shadow-md z-10">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <i className="fas fa-microscope text-xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">DrissionPage <span className="text-blue-400">Playground</span></h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Web Automation Locator Tester</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <a href="https://www.drissionpage.cn/" target="_blank" className="hover:text-blue-400 transition-colors flex items-center gap-1">
            <i className="fas fa-external-link-alt text-xs"></i> Official Docs
          </a>
          <div className="h-4 w-[1px] bg-slate-700"></div>
          <a href="https://github.com/g1879/DrissionPage" target="_blank" className="hover:text-blue-400 transition-colors">
            <i className="fab fa-github text-lg"></i>
          </a>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden bg-gray-100">
        {/* Main Content */}
        <main className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
          
          {/* Controls */}
          <section className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <i className="fas fa-globe absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input 
                  type="text" 
                  value={state.url}
                  onChange={(e) => setState(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="Enter URL to simulate fetch..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                />
              </div>
              <button 
                onClick={handleFetch}
                disabled={state.isLoading}
                className="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-700 disabled:opacity-50 flex items-center gap-2 font-medium transition-colors"
              >
                {state.isLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-cloud-download-alt"></i>}
                Fetch Page
              </button>
            </div>

            <div className="flex gap-3">
              <div className="flex-1 relative">
                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input 
                  type="text" 
                  value={state.selector}
                  onChange={(e) => setState(prev => ({ ...prev, selector: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && handleRunSelector()}
                  placeholder="Enter DrissionPage Locator (e.g. @id=main-content or tag:div@class=item)..."
                  className="w-full pl-10 pr-4 py-3 bg-blue-50 border border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-sm transition-all"
                />
              </div>
              <button 
                onClick={handleRunSelector}
                disabled={state.isLoading}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-bold shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
              >
                {state.isLoading ? <i className="fas fa-cog fa-spin"></i> : <i className="fas fa-play"></i>}
                Run Locator
              </button>
            </div>
          </section>

          {/* Workspace Area */}
          <section className="flex-1 flex gap-4 min-h-0">
            {/* Left: Input HTML/Preview */}
            <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="flex border-b border-gray-200 bg-gray-50">
                <button 
                  onClick={() => setState(prev => ({ ...prev, activeTab: 'source' }))}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${state.activeTab === 'source' ? 'bg-white border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <i className="fas fa-code mr-2"></i> HTML Source
                </button>
                <button 
                  onClick={() => setState(prev => ({ ...prev, activeTab: 'preview' }))}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${state.activeTab === 'preview' ? 'bg-white border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <i className="fas fa-eye mr-2"></i> Visual Preview
                </button>
              </div>
              <div className="flex-1 overflow-auto p-4 relative">
                {state.activeTab === 'source' ? (
                  <textarea 
                    value={state.html}
                    onChange={(e) => setState(prev => ({ ...prev, html: e.target.value }))}
                    className="w-full h-full font-mono text-xs p-4 bg-slate-50 border border-gray-100 rounded focus:outline-none resize-none leading-relaxed"
                  />
                ) : (
                  <div 
                    className="prose prose-sm max-w-none border border-gray-100 p-4 rounded bg-white shadow-inner min-h-full"
                    dangerouslySetInnerHTML={{ __html: state.html }}
                  />
                )}
              </div>
            </div>

            {/* Right: Results Panel */}
            <div className="w-1/3 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-slate-800 text-white p-3 flex justify-between items-center">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <i className="fas fa-list-ul"></i> Results
                </h3>
                {state.result && (
                  <span className="bg-blue-500 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                    {state.result.count} Matches
                  </span>
                )}
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {state.isLoading ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="text-sm font-medium">Extracting elements...</p>
                  </div>
                ) : state.result?.elements.length ? (
                  <div className="space-y-4">
                    {state.result.elements.map((el, i) => (
                      <div key={i} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:border-blue-300 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                            {el.tag}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">#{i + 1}</span>
                        </div>
                        <div className="text-sm font-medium text-gray-800 mb-2 break-words">
                          {el.text || <span className="text-gray-300 italic">No direct text</span>}
                        </div>
                        <div className="space-y-1">
                          {Object.entries(el.attributes).map(([key, val]) => (
                            <div key={key} className="flex gap-2 text-[11px]">
                              <span className="text-blue-500 font-semibold">{key}:</span>
                              <span className="text-gray-600 truncate" title={val}>{val}</span>
                            </div>
                          ))}
                        </div>
                        <details className="mt-3">
                          <summary className="text-[10px] font-bold text-gray-400 cursor-pointer hover:text-gray-600 uppercase tracking-widest">View Source</summary>
                          <pre className="mt-2 p-2 bg-gray-900 text-green-400 text-[10px] rounded overflow-x-auto font-mono whitespace-pre-wrap leading-relaxed">
                            {el.html}
                          </pre>
                        </details>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-40">
                    <i className="fas fa-search-minus text-5xl mb-4"></i>
                    <p className="text-sm font-bold uppercase tracking-wider">No matches found</p>
                    <p className="text-xs mt-2">Try a different locator or check the HTML source.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>

        {/* Sidebar Help */}
        <CheatSheet />
      </div>

      {/* Footer / Status Bar */}
      <footer className="bg-white border-t border-gray-200 px-4 py-2 flex justify-between items-center text-[11px] text-gray-500">
        <div className="flex gap-4">
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> Gemini Engine Online</span>
          <span><i className="fas fa-file-code"></i> {state.html.length.toLocaleString()} chars</span>
        </div>
        <div className="flex items-center gap-1 font-medium">
          Powered by <span className="text-blue-600 font-bold">@google/genai</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
