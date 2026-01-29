import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface miniter {
  'getcanid' : ActorMethod<[], Principal>,
  'getimage' : ActorMethod<[], Uint8Array | number[]>,
  'getname' : ActorMethod<[], string>,
  'getowner' : ActorMethod<[], Principal>,
  'transferownership' : ActorMethod<[Principal], string>,
}
export interface _SERVICE extends miniter {}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
