import {Button, Divider, Table, Space} from 'antd';
import {Symbol, SymbolTable, SymbolUsage} from 'charplex';
import {ColumnsType} from 'antd/es/table';
import {useEffect, useState} from 'react';

export type FileBarProps = {
  onRun: () => void;
  sb: SymbolTable | null;
}

export const FileBar = (p: FileBarProps) => {
  const [state, setState] = useState<SymbolTable | null>(p.sb);

  useEffect(() => {
    setState(p.sb);
  }, [p.sb]);

  if (!state) {
    return (
      <div className="file-bar">
        <Button onClick={p.onRun} type="primary" size="large">Run</Button>
      </div>
    );
  }

  const columns: ColumnsType<Symbol> = [
    {
      title: 'Nombre',
      dataIndex: 'name',
    },
    {
      title: 'Tipo',
      dataIndex: 'kind',
    },
    {
      title: 'Rangos',
      dataIndex: 'usages',
      render: (us: SymbolUsage[], _, i) => {
        return us.map(u => u.token.range)
          .map(r => JSON.stringify(r))
          .join(' ');
      },
    },
  ];

  return (
    <div className="file-bar">
      <Button onClick={p.onRun} type="primary" size="large">Run</Button>
      <Divider/>
      <p>{state.displayName}</p>
      <Table dataSource={Object.values(state.symbols)} columns={columns} rowKey="name" pagination={false}/>
      <Divider/>
      <Space direction="vertical" size="middle">
        <p>Scopes anidados</p>
        {Object.values(state.underScopes).map(us => {
          return <Button type="ghost" key={us.displayName} onClick={() => setState(us)}>{us.displayName}</Button>;
        })}
        {state.scope !== 'global' && <Button onClick={() => setState(state.upperScope)}>Atras</Button>}
      </Space>
    </div>
  );
};
