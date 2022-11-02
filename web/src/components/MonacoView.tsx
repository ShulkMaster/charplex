import {editor, languages} from 'monaco-editor';
import {
  FloatMachine,
  IdentifiersMachine,
  IntegerMachine,
  KeywordMachine,
  Lexer,
  MachineToken,
  OperatorsMachine,
  CommentsMachine,
  StringMachine,
  SymbolTableManager,
} from 'charplex';
import MonacoEditor from 'react-monaco-editor';
import React, {useLayoutEffect} from 'react';
import {AppState} from '../App';

languages.register({
  id: 'charplex',
});

const tokenTypes: MachineToken['kind'][] = [
  'operator',
  'identifier',
  'keyword',
  'comments',
  'string',
  'RealToken',
  'IntegerToken',
  'punctuation',
];

editor.defineTheme('charplexTheme', {
  base: 'vs-dark',
  inherit: true,
  colors: {},
  rules: [
    {token: 'comments', foreground: '00ff00', fontStyle: 'italic'},
    {token: 'keyword', foreground: 'ce63eb'},
    {token: 'operator', foreground: 'f0ff00'},
    {token: 'IntegerToken', foreground: '66afce'},

    {token: 'type', foreground: '1db010'},
    {token: 'punctuation', foreground: 'de8004'},
    {token: 'class', foreground: '0000ff', fontStyle: 'bold'},
    {token: 'RealToken', foreground: '007700', fontStyle: 'bold'},


    {token: 'identifier', foreground: 'bfa13e'},

    {token: 'type.static', fontStyle: 'bold'},
    {token: 'string', foreground: 'ff0000', fontStyle: 'bold'},
  ],
});

export type MonacoViewProps = {
  code: string;
  onCode: (s: AppState) => void;
}

export const MonacoView = (p: MonacoViewProps) => {

  useLayoutEffect(() => {
    const disposable = languages.registerDocumentSemanticTokensProvider('charplex', {
      onDidChange: undefined,
      getLegend(): languages.SemanticTokensLegend {
        return {
          tokenTypes,
          tokenModifiers: [],
        };
      },
      provideDocumentSemanticTokens(model: editor.ITextModel): languages.ProviderResult<languages.SemanticTokens | languages.SemanticTokensEdits> {
        const lines = model.getValue();
        const table = new SymbolTableManager();
        const intMachine = new IntegerMachine(lines);
        const cMachine = new CommentsMachine(lines);
        const stringMachine = new StringMachine(lines);
        const identifierMachine = new IdentifiersMachine(lines, table);
        const floatMachine = new FloatMachine(lines);
        const keywordsMachine = new KeywordMachine(lines);
        const operatorsMachine = new OperatorsMachine(lines);

        const lexer = new Lexer(
          table,
          cMachine,
          keywordsMachine,
          floatMachine,
          operatorsMachine,
          intMachine,
          stringMachine,
          identifierMachine,
        );
        lexer.source = lines;
        const tokens: MachineToken[] = [];
        const batch: number[] = [];
        let prevLine = 0;
        let prevChar = 0;
        for (const token of lexer.tokenStream()) {
          tokens.push(token);
          const index = tokenTypes.indexOf(token.kind);
          if (index === -1) continue;

          if (token.r === prevLine) {
            batch.push(0, token.r - prevChar, token.src.length, index, 0);
          } else {
            batch.push(token.r - prevLine, token.r, token.src.length, index, 0);
          }
          prevLine = token.r;
          prevChar = token.c;
        }
        p.onCode({
          tokens,
          table: table.getGlobal(),
        });
        return {
          resultId: undefined,
          data: new Uint32Array(batch),
        };
      },
      releaseDocumentSemanticTokens(resultId: string | undefined): void {
      },
    });
    return () => {
      disposable.dispose();
    };
  }, []);

  return (
    <MonacoEditor
      height="100%"
      width="45%"
      language="charplex"
      theme="charplexTheme"
      defaultValue={p.code}
      options={{
        'semanticHighlighting.enabled': true,
        fontSize: 20,
        minimap: {
          enabled: false,
        },
      }}
    />
  );
};
