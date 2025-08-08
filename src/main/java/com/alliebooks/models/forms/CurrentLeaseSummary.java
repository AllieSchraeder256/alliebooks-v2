package com.alliebooks.models.forms;

import com.alliebooks.models.Lease;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public class CurrentLeaseSummary implements Serializable {

	private UUID leaseId;
	private String details;
}
