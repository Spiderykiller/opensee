export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'freetoken' : IDL.Func([], [IDL.Text], []),
    'getBalance' : IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    'getSymbol' : IDL.Func([], [IDL.Text], ['query']),
    'transfer' : IDL.Func([IDL.Principal, IDL.Nat], [IDL.Text], []),
  });
};
export const init = ({ IDL }) => { return []; };
