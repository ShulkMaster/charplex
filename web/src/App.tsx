import React, {useState} from 'react';
import {Layout} from 'antd';
import logo from 'assets/img/csharp.svg';
import {FileBar} from './components/fileBar/FileBar';
import {TokenList} from './components/TokenList';
import MonacoEditor from 'react-monaco-editor';
import {
  Lexer,
  MachineToken,
  StringMachine,
  IntegerMachine,
  IdentifiersMachine,
  FloatMachine,
  KeywordMachine,
  OperatorsMachine,
  SymbolTable,
  SymbolTableManager,
} from 'charplex';
import 'antd/dist/antd.min.css';
import './App.scss';

type AppState = {
  tokens: MachineToken[];
  table: SymbolTable | null;
}

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
  const [state, setState] = useState<AppState>({
    tokens: [],
    table: null,
  });


  const onRun = () => {
    const table = new SymbolTableManager();
    const intMachine = new IntegerMachine(code);
    const stringMachine = new StringMachine(code);
    const identifierMachine = new IdentifiersMachine(code, table);
    const floatMachine = new FloatMachine(code);
    const keywordsMachine = new KeywordMachine(code);
    const operatorsMachine = new OperatorsMachine(code);

    const lexer = new Lexer(
      table,
      keywordsMachine,
      floatMachine,
      operatorsMachine,
      intMachine,
      stringMachine,
      identifierMachine,
    );
    lexer.source = code;

    const batch: MachineToken[] = [];
    for (const token of lexer.tokenStream()) {
      batch.push(token);
    }

    lexer.unregisterOnMachineChange();
    setState({
      tokens: batch,
      table: table.getGlobal(),
    });
    console.log(table.getGlobal());
  };

  return (
    <Layout>
      <Layout.Header className="app-header">
        <img src={logo} alt="GAF energy logo" className="logo"/>
        <p className="app-title">Charplex</p>
      </Layout.Header>
      <Layout.Content className="app-content">
        <MonacoEditor
          height="100%"
          width="45%"
          language="c#"
          theme="vs-dark"
          value={code}
          options={{
            'semanticHighlighting.enabled': false, fontSize: 20, minimap: {
              enabled: false,
            },
          }}
          onChange={setCode}
          editorDidMount={console.log}
        />
        <FileBar onRun={onRun} sb={state.table}/>
        <TokenList tokens={state.tokens}/>
      </Layout.Content>
    </Layout>
  );
};
