import { Button } from 'antd';

export type FileBarProps = {
  onRun: () => void;
}

export const FileBar = (p: FileBarProps) => {
  return (
    <div className="file-bar">
      <Button onClick={p.onRun}>Run</Button>
    </div>
  )
}
