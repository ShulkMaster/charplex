import React from 'react';
import {Layout} from 'antd';
import logo from 'assets/img/csharp.svg';
import {FileBar} from './components/fileBar/FileBar';
import MonacoEditor from 'react-monaco-editor';
import 'antd/dist/antd.min.css';
import './App.scss';

export const App = () => {

  const onChange = (newValue: string) => {
      console.log('onChange', newValue);
  }

  const code = 'namespace HelloWorld\n' +
    '{\n' +
    '    class Hello {         \n' +
    '        static void Main(string[] args)\n' +
    '        {\n' +
    '            System.Console.WriteLine("Hello World!");\n' +
    '        }\n' +
    '    }\n' +
    '}';
  const options = {
    selectOnLineNumbers: true
  };

  return (
    <Layout>
      <Layout.Header className="app-header">
        <img src={logo} alt="GAF energy logo" className="logo" />
        <p className="app-title">Charplex</p>
      </Layout.Header>
      <Layout.Content className="app-content">
        <FileBar onRun={console.log} />
        <MonacoEditor
          height="100%"
          language="c#"
          theme="vs-dark"
          value={code}
          options={{'semanticHighlighting.enabled': false}}
          onChange={onChange}
          editorDidMount={console.log}
        />
      </Layout.Content>
      <Layout.Footer>
        <div>
          <p>ALV</p>
        </div>
      </Layout.Footer>
    </Layout>
  );
};
