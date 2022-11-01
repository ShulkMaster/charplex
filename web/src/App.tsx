import React, {useState} from 'react';
import {Layout} from 'antd';
import logo from 'assets/img/csharp.svg';
import {FileBar} from './components/fileBar/FileBar';
import {TokenList} from './components/TokenList';
import MonacoEditor from 'react-monaco-editor';
import {languages, editor} from 'monaco-editor';
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

languages.register({
  id: 'charplex',
});

const tokenTypes = [
  'operator',
  'identifier',
  'keyword',
  'string',
  'RealToken',
  'IntegerToken',
  'punctuation',
];

languages.registerDocumentSemanticTokensProvider('charplex', {
  onDidChange: undefined,
  getLegend(): languages.SemanticTokensLegend {
    return {
      tokenTypes,
      tokenModifiers: [],
    };
  },
  provideDocumentSemanticTokens(model: editor.ITextModel, lastResultId: string | null, to): languages.ProviderResult<languages.SemanticTokens | languages.SemanticTokensEdits> {
    const lines = model.getLinesContent().join('\n');
    console.log(lines);
    const table = new SymbolTableManager();
    const intMachine = new IntegerMachine(lines);
    const stringMachine = new StringMachine(lines);
    const identifierMachine = new IdentifiersMachine(lines, table);
    const floatMachine = new FloatMachine(lines);
    const keywordsMachine = new KeywordMachine(lines);
    const operatorsMachine = new OperatorsMachine(lines);

    const lexer = new Lexer(
      table,
      keywordsMachine,
      floatMachine,
      operatorsMachine,
      intMachine,
      stringMachine,
      identifierMachine,
    );
    lexer.source = lines;

    const batch: number[] = [];
    let last: MachineToken | null = null;
    for (const token of lexer.tokenStream()) {
      const index = tokenTypes.indexOf(token.kind);
      if(index === -1) continue;
      if(last) {
        console.log(0, token.range[0] - last.range[0], token.src.length, index, 0);
        batch.push(0, token.range[0] - last.range[0], token.src.length, index, 0);
      }else {
        console.log(0, token.range[0], token.src.length, index, 0);
        batch.push(0, token.range[0], token.src.length, index, 0);
      }
      last = token;
    }
    return {
      resultId: undefined,
      data: new Uint32Array(batch),
    };
  },
  releaseDocumentSemanticTokens(resultId: string | undefined): void {
  },
});

editor.defineTheme('charplexTheme', {
  base: 'vs-dark',
  inherit: true,
  colors: {},
  rules: [
    {token: 'comment', foreground: 'aaaaaa', fontStyle: 'italic'},
    {token: 'keyword', foreground: 'ce63eb'},
    {token: 'operator', foreground: '00ff00'},
    {token: 'IntegerToken', foreground: '66afce'},

    {token: 'type', foreground: '1db010'},
    {token: 'struct', foreground: '0000ff'},
    {token: 'class', foreground: '0000ff', fontStyle: 'bold'},
    {token: 'RealToken', foreground: '007700', fontStyle: 'bold'},
    {token: 'enum', foreground: '0077ff', fontStyle: 'bold'},
    {token: 'typeParameter', foreground: '1db010'},
    {token: 'function', foreground: '94763a'},

    {token: 'member', foreground: '94763a'},
    {token: 'macro', foreground: '615a60'},
    {token: 'variable', foreground: '3e5bbf'},
    {token: 'parameter', foreground: '3e5bbf'},
    {token: 'property', foreground: '3e5bbf'},
    {token: 'label', foreground: '615a60'},

    {token: 'type.static', fontStyle: 'bold'},
    {token: 'string', foreground: 'ff0000', fontStyle: 'bold'},
  ],
});

type AppState = {
  tokens: MachineToken[];
  table: SymbolTable | null;
}

export const App = () => {

  const [code, setCode] = useState('void 5 Main 45 .47 + void 4');
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
          language="charplex"
          theme="charplexTheme"
          value={code}
          options={{
            'semanticHighlighting.enabled': true,
            fontSize: 20,
            minimap: {
              enabled: false,
            },
          }}
          onChange={setCode}
        />
        <FileBar onRun={onRun} sb={state.table}/>
        <TokenList tokens={state.tokens}/>
      </Layout.Content>
    </Layout>
  );
};
