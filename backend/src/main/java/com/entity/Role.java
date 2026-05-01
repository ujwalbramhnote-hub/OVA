package com.entity;

public enum Role {
    ADMIN,
    VOTER,
    CANDIDATE;

    public static Role fromValue(String value) {
        if (value == null) {
            return VOTER;
        }

        return switch (value.trim().toUpperCase()) {
            case "ADMIN", "ROLE_ADMIN" -> ADMIN;
            case "CANDIDATE", "ROLE_CANDIDATE" -> CANDIDATE;
            case "VOTER", "ROLE_USER", "ROLE_VOTER" -> VOTER;
            default -> Role.valueOf(value.trim().toUpperCase());
        };
    }
}
