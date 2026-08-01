export type PythonBaseType = 
  | 'int' 
  | 'float' 
  | 'str' 
  | 'bool' 
  | 'list' 
  | 'tuple' 
  | 'dict' 
  | 'set' 
  | 'bytes';

export type DataType = PythonBaseType | string;

export interface Port {
  id: string;
  name: string;
  dataType: DataType;
}

export interface FunctionNodeData {
  label: string;
  inputs: Port[];
  outputs: Port[];
  [key: string]: unknown;
}