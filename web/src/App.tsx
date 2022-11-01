import React, {useState} from 'react';
import {Layout} from 'antd';
import logo from 'assets/img/csharp.svg';
import {FileBar} from './components/fileBar/FileBar';
import {TokenList} from './components/TokenList';
import {MachineToken, SymbolTable} from 'charplex';
import {MonacoView} from './components/MonacoView';
import 'antd/dist/antd.min.css';
import './App.scss';

export type AppState = {
  tokens: MachineToken[];
  table: SymbolTable | null;
}

export const App = () => {

  const [code, setCode] = useState('using System;\n' +
    'public class Addition\n' +
    '{\n' +
    '    public static void Main(string[] args)\n' +
    '    {\n' +
    '        int num1=35;\n' +
    '        int num2=30;\n' +
    '        int sum=num1+num2;\n' +
    '        Console.WriteLine ("The sum of two numbers: "+sum);\n' +
    '    }\n' +
    '}');
  const [state, setState] = useState<AppState>({
    tokens: [],
    table: null,
  });

  return (
    <Layout>
      <Layout.Header className="app-header">
        <img src={logo} alt="GAF energy logo" className="logo"/>
        <p className="app-title">Charplex</p>
      </Layout.Header>
      <Layout.Content className="app-content">
        <MonacoView code={code} onCode={setState}/>
        <FileBar sb={state.table}/>
        <TokenList tokens={state.tokens}/>
      </Layout.Content>
    </Layout>
  );
};
