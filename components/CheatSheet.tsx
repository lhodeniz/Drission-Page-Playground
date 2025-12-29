
import React from 'react';

const CheatSheet: React.FC = () => {
  const items = [
    { label: 'Property', value: '@id=login', desc: 'Finds element with id "login"' },
    { label: 'Tag', value: 'tag:div', desc: 'Finds first div element' },
    { label: 'Text', value: 'text:Submit', desc: 'Finds element containing text "Submit"' },
    { label: 'Combined', value: 'tag:button@class=btn-primary', desc: 'Finds button with specific class' },
    { label: 'CSS', value: 'css:.main > p', desc: 'Standard CSS selector' },
    { label: 'XPath', value: 'xpath://div[@id="app"]', desc: 'Standard XPath' },
    { label: 'Property Existence', value: '@href', desc: 'Finds elements with href attribute' },
    { label: 'Fuzzy Match', value: 'text=Click', desc: 'Finds text matching "Click" partially' },
  ];

  return (
    <div className="bg-white border-l border-gray-200 w-80 h-full overflow-y-auto p-4 hidden lg:block">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <i className="fas fa-book text-blue-600"></i>
        Locator Help
      </h3>
      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="group">
            <div className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">{item.label}</div>
            <code className="block bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm font-mono break-all mb-1 group-hover:bg-blue-100 transition-colors">
              {item.value}
            </code>
            <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-500 italic">
          "DrissionPage combines Selenium's ease of use with requests' performance. Its locator syntax is uniquely flexible."
        </p>
      </div>
    </div>
  );
};

export default CheatSheet;
