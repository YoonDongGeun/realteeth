import { ParcelAddress } from "@shared/model";

export interface FavoriteLocation {
  address: ParcelAddress; // id로도 사용
  alias?: string; // 별칭 (선택)
}
