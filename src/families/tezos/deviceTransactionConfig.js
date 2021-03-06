// @flow

import type { AccountLike, Account, TransactionStatus } from "../../types";
import type { Transaction } from "./types";
import type { DeviceTransactionField } from "../../transaction";
import { getMainAccount } from "../../account";

export type ExtraDeviceTransactionField =
  | { type: "tezos.delegateValidator", label: string }
  | { type: "tezos.storageLimit", label: string };

function getDeviceTransactionConfig({
  account,
  parentAccount,
  transaction,
  status,
}: {
  account: AccountLike,
  parentAccount: ?Account,
  transaction: Transaction,
  status: TransactionStatus,
}): Array<DeviceTransactionField> {
  const { amount } = transaction;
  const { estimatedFees } = status;
  const mainAccount = getMainAccount(account, parentAccount);
  const source =
    account.type === "ChildAccount"
      ? account.address
      : mainAccount.freshAddress;
  const isDelegateOperation = transaction.mode === "delegate";

  const fields = [
    {
      type: "address",
      label: "Source",
      address: source,
    },
  ];

  if (isDelegateOperation) {
    fields.push(
      {
        type: "tezos.delegateValidator",
        label: "Validator",
      },
      {
        type: "address",
        label: "Delegate",
        address: transaction.recipient,
      }
    );
  }

  if (!amount.isZero()) {
    fields.push({
      type: "amount",
      label: "Amount",
    });
  }

  if (!estimatedFees.isZero()) {
    fields.push({
      type: "fees",
      label: "Fees",
    });
  }

  fields.push({
    type: "tezos.storageLimit",
    label: "Storage Limit",
  });

  return fields;
}

export default getDeviceTransactionConfig;
