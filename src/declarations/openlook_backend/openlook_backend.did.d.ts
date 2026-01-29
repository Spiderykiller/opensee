import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface _SERVICE {
  'checkorginalowner' : ActorMethod<[Principal], Principal>,
  'createnft' : ActorMethod<[Uint8Array | number[], string], Principal>,
  'finalpurchase' : ActorMethod<[Principal, Principal, Principal], string>,
  'getitemstatus' : ActorMethod<[Principal], boolean>,
  'getlistedids' : ActorMethod<[], Array<Principal>>,
  'getusersid' : ActorMethod<[Principal], Array<Principal>>,
  'openlookid' : ActorMethod<[], Principal>,
  'pricelistednfts' : ActorMethod<[Principal], bigint>,
  'sellitem' : ActorMethod<[Principal, bigint], string>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
