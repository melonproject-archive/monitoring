export interface Fund {
  id: string;
  name?: string;
  manager?: string;
  creationTime?: string;
  isShutdown?: boolean;
  shutDownTime?: string;
  accounting?: Accounting;
  participation?: Participation;
  feeManager?: FeeManager;
  policyManager?: PolicyManager;
  shares?: Shares;
  trading?: Trading;
  vault?: Vault;
  registry?: Registry;
  version?: Version;
  engine?: Engine;
  gav?: string;
  feesInDenominationAsset?: string;
  feesInShares?: string;
  nav?: string;
  sharePrice?: string;
  grossSharePrice?: string;
  gavPerShareNetManagementFee?: string;
  allocatedFees?: string;
  totalSupply?: string;
  investments?: Investment;
  calculationsUpdates?: FundCalculationsUpdate;
  investmentLog?: InvestmentLog;
  holdingsLog?: FundHoldingsLog;
  lastCalculationsUpdate?: string;
}

// tslint:disable:no-empty-interface
export interface Registry {}

export interface Version {}

export interface Engine {}

export interface Accounting {}

export interface Trading {}

export interface Vault {}

export interface FeeManager {}

export interface Participation {}

export interface PolicyManager {}

export interface Shares {}

export interface Investment {}

export interface FundCalculationsUpdate {}

export interface FundCalculationsUpdate {}

export interface InvestmentLog {}

export interface FundHoldingsLog {}
