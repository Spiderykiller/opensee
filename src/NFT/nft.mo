import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import Nat8 "mo:base/Nat8";

persistent actor class miniter(name: Text, id: Principal, image: [Nat8]) = this {
   
   private let itemname = name;
   private var ownerid = id;
   private let codeimage = image;

   public query func getname() : async Text {
     return itemname;
   };
    public query func getowner() : async Principal {
      return ownerid;
    };
    public query func getimage() : async [Nat8] {
      return codeimage;

};
    public query func getcanid() : async Principal {
      return Principal.fromActor(this);
    };

    public shared(msg) func transferownership(newowner: Principal): async Text {
      if (msg.caller == ownerid) {
        ownerid := newowner;
        return "Success";
      } else {
        return "Not initiated by owner.";
      }
    };

}