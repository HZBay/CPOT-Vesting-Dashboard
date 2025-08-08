export enum AllocationCategory {
  MINING = 0,
  ECOSYSTEM = 1,
  TEAM = 2,
  CORNERSTONE = 3
}

export const AllocationCategoryMapping: { [key in AllocationCategory]: string } = {
  [AllocationCategory.MINING]: "MINING",
  [AllocationCategory.ECOSYSTEM]: "ECOSYSTEM",
  [AllocationCategory.TEAM]: "TEAM",
  [AllocationCategory.CORNERSTONE]: "CORNERSTONE",
};

export enum VestingType {
  LINEAR = 0,
  MILESTONE = 1,
  CLIFF_LINEAR = 2
}

export const VestingTypeMapping: { [key in VestingType]: string } = {
  [VestingType.LINEAR]: "LINEAR",
  [VestingType.MILESTONE]: "MILESTONE",
  [VestingType.CLIFF_LINEAR]: "CLIFF_LINEAR",
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

export interface VestingScheduleWithId {
  id: `0x${string}`;
  schedule: VestingSchedule;
}

// This is the type that is passed to the ScheduleCard component.
export interface VestingScheduleWithIdAndDetails extends VestingSchedule {
  id: `0x${string}`;
}


export interface VestingProgress {
  totalAmount: bigint;
  releasedAmount: bigint;
  releasableAmount: bigint;
  lockedAmount: bigint;
}
