import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { assert } from "chai";
import { Programma } from "../target/types/programma";

describe("programma", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Programma as Program<Programma>;

  let cont= anchor.web3.Keypair.generate();

  it("Can sett number??", async () => {
    // Add your test here.
    //const tx = await program.methods.initialize().rpc();
    //console.log("Your transaction signature", tx);
    await program.rpc.initialize(911,{
      accounts:{
        contatore: cont.publicKey,
        user: provider.wallet.publicKey,
        systemProgram : anchor.web3.SystemProgram.programId,
    },
    signers:[cont]});
    let newNumeroCont = await program.account.contatore.fetch(cont.publicKey);

    assert.strictEqual(newNumeroCont.numero,911);
  });

  it("can increment number", async()=>{
    let previusNumber = await program.account.contatore.fetch(cont.publicKey);
    await program.rpc.add({
      accounts:{
        contatore:cont.publicKey,
        user:provider.wallet.publicKey,
      }});

      let newNumber = await program.account.contatore.fetch(cont.publicKey);
      
      assert.strictEqual(newNumber.numero, (previusNumber.numero+1));
  })
  it("can decrement number?",async () => {
    let previusNumber = await program.account.contatore.fetch(cont.publicKey);
    await program.rpc.dec({
      accounts:{
        contatore:cont.publicKey,
        user:provider.wallet.publicKey,
      }
    });
    let newNumber= await program.account.contatore.fetch(cont.publicKey);

    assert.strictEqual(newNumber.numero,previusNumber.numero-1);

  })
});

