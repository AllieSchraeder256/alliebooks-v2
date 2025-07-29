package com.alliebooks.models.forms;

import com.alliebooks.models.Lease;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class LeaseForm extends FormModelBase {

	private Double balance;

	private String startDate;

	private String endDate;

	private Boolean current;

	private Double rent;

	private Double deposit;

	private String depositPaidDate;

	private Double depositReturned;

	private String depositReturnDate;

	private UUID unitId;

	private List<UUID> tenantIds;

	public Lease toModel(Lease existingLease) {
		var lease = existingLease == null ? new Lease() : existingLease;

		if (current != null) {
			lease.setCurrent(current);
		}
		if (balance != null) {
			lease.setBalance(balance);
		}
		if (startDate != null) {
			lease.setStartDate(parseDateNoTime(startDate));
		}
		if (endDate != null) {
			lease.setEndDate(parseDateNoTime(endDate));
		}
		if (rent != null) {
			lease.setRent(rent);
		}
		if (deposit != null) {
			lease.setDeposit(deposit);
		}
		if (depositPaidDate != null) {
			lease.setDepositPaidDate(parseDateNoTime(depositPaidDate));
		}
		if (depositReturned != null) {
			lease.setDepositReturned(depositReturned);
		}
		if (depositReturnDate != null) {
			lease.setDepositReturnDate(parseDateNoTime(depositReturnDate));
		}
		if (unitId != null) {
			lease.setUnitId(unitId);
		}
		return lease;
	}
}
