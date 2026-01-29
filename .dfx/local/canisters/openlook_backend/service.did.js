export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'checkorginalowner' : IDL.Func([IDL.Principal], [IDL.Principal], ['query']),
    'createnft' : IDL.Func([IDL.Vec(IDL.Nat8), IDL.Text], [IDL.Principal], []),
    'finalpurchase' : IDL.Func(
        [IDL.Principal, IDL.Principal, IDL.Principal],
        [IDL.Text],
        [],
      ),
    'getitemstatus' : IDL.Func([IDL.Principal], [IDL.Bool], ['query']),
    'getlistedids' : IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
    'getusersid' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(IDL.Principal)],
        ['query'],
      ),
    'openlookid' : IDL.Func([], [IDL.Principal], ['query']),
    'pricelistednfts' : IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    'sellitem' : IDL.Func([IDL.Principal, IDL.Nat], [IDL.Text], []),
  });
};
export const init = ({ IDL }) => { return []; };
