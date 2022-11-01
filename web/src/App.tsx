import React, {useState} from 'react';
import {Layout} from 'antd';
import logo from 'assets/img/csharp.svg';
import {FileBar} from './components/fileBar/FileBar';
import {TokenList} from './components/TokenList';
import MonacoEditor from 'react-monaco-editor';
import {Lexer, MachineToken, StringMachine, IntegerMachine, IdentifiersMachine, FloatMachine} from 'charplex';
import 'antd/dist/antd.min.css';
import './App.scss';

export const App = () => {

  const [code, setCode] = useState('namespace HelloWorld\n' +
    '{\n' +
    '    class Hello {         \n' +
    '        static void Main(string[] args)\n' +
    '        {\n' +
    '            System.Console.WriteLine("Hello World!");\n' +
    '        }\n' +
    '    }\n' +
    '}');
  const [tokens, setTokens] = useState<MachineToken[]>([]);


  const onRun = () => {
    const intMachine = new IntegerMachine(code);
    const stringMachine = new StringMachine(code);
    const identifierMachine = new IdentifiersMachine(code);
    const floatMachine = new FloatMachine(code);
    const lexer = new Lexer([intMachine, floatMachine, stringMachine, identifierMachine]);
    lexer.source = code;

    const batch: MachineToken[] = [];
    for (const token of lexer.tokenStream()) {
      batch.push(token);
    }

    lexer.unregisterOnMachineChange();
    setTokens(batch);
  };

  return (
    <Layout>
      <Layout.Header className="app-header">
        <img src={logo} alt="GAF energy logo" className="logo"/>
        <p className="app-title">Charplex</p>
      </Layout.Header>
      <Layout.Content className="app-content">
        <FileBar onRun={onRun}/>
        <MonacoEditor
          height="100%"
          width="65%"
          language="c#"
          theme="vs-dark"
          value={code}
          options={{'semanticHighlighting.enabled': false, fontSize: 20}}
          onChange={setCode}
          editorDidMount={console.log}
        />
        <TokenList tokens={tokens}/>
      </Layout.Content>
      <Layout.Footer className="footer">
        <div>
          <p>ALV</p>
        </div>
      </Layout.Footer>
    </Layout>
  );
};
