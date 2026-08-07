package com.devnet.stagetracker.util;

import java.time.LocalDate;

public class DateUtil {

    private DateUtil() {
    }

    public static boolean estPeriodeValide(LocalDate debut, LocalDate fin) {
        return debut != null && fin != null && debut.isBefore(fin);
    }

    public static boolean estDansLeFutur(LocalDate date) {
        return date != null && date.isAfter(LocalDate.now());
    }

    public static boolean periodesSeChevauchent(LocalDate debut1, LocalDate fin1, LocalDate debut2, LocalDate fin2) {
        return !debut1.isAfter(fin2) && !debut2.isAfter(fin1);
    }
}
