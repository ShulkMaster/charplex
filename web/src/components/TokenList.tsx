import { List } from 'antd';
import ReactJson from 'react-json-view'
import {MachineToken} from 'charplex';

export type TokenListProps = {
  tokens: MachineToken[]
}

export const TokenList = (p: TokenListProps) => {
  return (
    <div className="token-list">
      <List
        itemLayout="vertical"
        dataSource={p.tokens}
        renderItem={(token: MachineToken) => (
          <List.Item>
            <p>{token.name}: {token.src}</p>
            <ReactJson src={token} collapsed={false}/>
          </List.Item>
        )}
      />
    </div>
  )
}
