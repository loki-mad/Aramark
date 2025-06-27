package com.zosh.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Objects;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Address {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String fullName;

	private String streetAddress;

	private String city;

	private String state;

	private String postalCode;

	private String country;

	@Override
	public boolean equals(Object o) {
		if (this == o)
			return true;
		if (o == null || getClass() != o.getClass())
			return false;
		Address address = (Address) o;

		// If IDs are present and equal, addresses are equal
		if (id != null && address.id != null) {
			return Objects.equals(id, address.id);
		}

		// Otherwise compare fields (excluding ID)
		return Objects.equals(streetAddress, address.streetAddress) &&
				Objects.equals(city, address.city) &&
				Objects.equals(state, address.state) &&
				Objects.equals(postalCode, address.postalCode) &&
				Objects.equals(country, address.country);
	}

	@Override
	public int hashCode() {
		// If ID is present, use it for hashCode
		if (id != null) {
			return Objects.hash(id);
		}
		// Otherwise use fields (excluding ID)
		return Objects.hash(streetAddress, city, state, postalCode, country);
	}
}
