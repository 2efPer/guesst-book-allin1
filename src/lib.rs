use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::{env,near_bindgen,PanicOnDefault,AccountId};
use near_sdk::serde::{Deserialize, Serialize};

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize,PanicOnDefault)]
pub struct Contract {
    pub msgs:UnorderedMap<AccountId,Message>
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Message{
    is_premium:bool,
    time:u64,
    content:String
}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self{
            msgs: UnorderedMap::new(b"m".to_vec())
        }
    }

    pub fn check_exist(&self,account_id:AccountId) -> bool{
        if let Some(_) = self.msgs.get(&account_id){
            true
        }else{
            false
        }
    }

    #[payable]
    pub fn add_msg(&mut self,msg_content:String){
        assert_ne!(self.check_exist(env::signer_account_id()) ,true,"You can only sign the guest book once");
        let msg = Message{
            is_premium: if env::attached_deposit()>0{true} else {false},
            time: env::block_timestamp(),
            content:msg_content
        };
        self.msgs.insert(&env::signer_account_id(), &msg);
    }

    pub fn get_msgs(&self,from_index:u64,limit:u64) -> Vec<(AccountId,Message)>{
        env::log(format!("from: {}, limit: {}",from_index,limit).as_ref());
        let keys = self.msgs.keys_as_vector();
        let values = self.msgs.values_as_vector();
        (from_index..std::cmp::min(from_index + limit, self.msgs.len()))
        .map(|index| (keys.get(index).unwrap(), values.get(index).unwrap()))
        .collect()
    }
}