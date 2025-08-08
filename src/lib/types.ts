export enum AllocationCategory {
  MINING = 0,
  ECOSYSTEM = 1,
  TEAM = 2,
  CORNERSTONE = 3
}

export const AllocationCategoryMapping: { [key in AllocationCategory]: string } = {
  [AllocationCategory.MINING]: "Mining Rewards",
  [AllocationCategory.ECOSYSTEM]: "Ecosystem & Ops",
  [AllocationCategory.TEAM]: "Team & Advisors",
  [AllocationCategory.CORNERSTONE]: "Cornerstone",
};

export enum VestingType {
  LINEAR = 0,
  MILESTONE = 1,
  CLIFF_LINEAR = 2
}

export const VestingTypeMapping: { [key in VestingType]: string } = {
  [VestingType.LINEAR]: "Linear",
  [VestingType.MILESTONE]: "Milestone",
  [VestingType.CLIFF_LINEAR]: "Cliff + Linear",
};

export interface VestingSchedule {
  initialized: boolean;
  beneficiary: `0x${string}`;
  cliff: bigint;
  start: bigint;
  duration: bigint;
  slicePeriodSeconds: bigint;
  revocable: boolean;
  amountTotal: bigint;
  released: bigint;
  revoked: boolean;
  category: AllocationCategory;
  vestingType: VestingType;
}

export interface VestingScheduleWithId extends VestingSchedule {
  id: string; 
}