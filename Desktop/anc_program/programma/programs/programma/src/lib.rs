use anchor_lang::prelude::*;

declare_id!("BdxKSDQz3XeF94DjTRPPo9q81j1rq6swG9ebgo5M97ih");

#[program]
pub mod programma {
    use super::*;

    pub fn initialize(ctx: Context<Start>, input_numero: u32) -> Result<()> {
        let cont = &mut ctx.accounts.contatore;
        let user = &mut ctx.accounts.user;
        cont.numero = input_numero;
        cont.user = *user.key;
        Ok(())
    }

    pub fn add(ctx: Context<Increment>) -> Result<()> {
        let cont = &mut ctx.accounts.contatore;
        let user = &mut ctx.accounts.user;
        cont.numero += 1;
        cont.user = *user.key;
        Ok(())
    }

    pub fn dec(ctx: Context<Decrement>) -> Result<()> {
        let cont = &mut ctx.accounts.contatore;
        let user = &mut ctx.accounts.user;
        if cont.numero > 0 {
            cont.numero -= 1;
        } else {
            msg!("Counter already 0");
        }

        cont.user = *user.key;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Start<'info> {
    #[account(
        init,
        payer=user,
        space=2000
    )]
    pub contatore: Account<'info, Contatore>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut)]
    pub contatore: Account<'info, Contatore>,
    #[account(mut)]
    pub user: Signer<'info>,
    //pub system_program: Program<'info, System>, //inutile qui
}

#[derive(Accounts)]
pub struct Decrement<'info> {
    #[account(mut)]
    pub contatore: Account<'info, Contatore>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[account]
pub struct Contatore {
    pub numero: u32,
    pub user: Pubkey,
}
