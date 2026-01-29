export const idlFactory = ({ IDL }) => {
  const miniter = IDL.Service({
    'getcanid' : IDL.Func([], [IDL.Principal], ['query']),
    'getimage' : IDL.Func([], [IDL.Vec(IDL.Nat8)], ['query']),
    'getname' : IDL.Func([], [IDL.Text], ['query']),
    'getowner' : IDL.Func([], [IDL.Principal], ['query']),
    'transferownership' : IDL.Func([IDL.Principal], [IDL.Text], []),
  });
  return miniter;
};
export const init = ({ IDL }) => {
  return [IDL.Text, IDL.Principal, IDL.Vec(IDL.Nat8)];
};
