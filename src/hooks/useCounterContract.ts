import {useEffect, useState } from 'react'
import {Demo} from '../contracts/Demo'
import {useTonClient} from './useTonClient'
import { useTonConnect} from './useTonConnect'
import { useAsyncInitialize} from './useAsyncInitialize'
import { Address, OpenedContract, toNano } from '@ton/core'


export function useCounterContract(){
  const client = useTonClient();
  const [val, setVal] = useState<null | number>();
  const { sender } = useTonConnect();

  // const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

  const counterContract = useAsyncInitialize(async () => {
    if(!client) return;
    const contract = new Demo(Address.parse('EQCb6tcTnDMw1MPzUIl3duI2a2Qj0uV3O3f_npF4rovlpB6z'))
    return client.open(contract) as OpenedContract<Demo>
  }, [client])

  useEffect(() => {
    async function getValue() {
      if(!counterContract) return
        setVal(null)
      // await sleep(5000); // sleep 5 seconds and poll value again
      // const val = await counterContract.getCounter()
      setVal(Number(val))
    }
    getValue()
  }, [counterContract])

  return {
    value: val,
    address: counterContract?.address.toString(),
    sendIncrement: ()=> {
      return counterContract?.sendIncrease(sender, {
        increaseBy: 1,
        value: toNano('0.02')
      });
    }
  }
}
