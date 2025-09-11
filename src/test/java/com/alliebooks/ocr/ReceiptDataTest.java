package com.alliebooks.ocr;

import org.junit.jupiter.api.Test;
import org.testng.annotations.Ignore;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;

@Ignore
public class ReceiptDataTest {
    static final String LOWES_RECEIPT_DATA = "LEARN WORE AT LOWES.COM/NYLOVESREWARDS\n\nLOWE'S HOHE CENTERS, LLC\n50 WEST SIDE MALL\n\nEDWARDSVILLE. PA 16704 (570) 265-6000\n\n~- SALE =\nSALES#H: FSTLANO3 4002862 TRANSH: 357665485 08-05-25\n\n751667 3/6-IN X 16-IN SS-TL (388 6.73\n/.08 DISCOUNT EACH -0.35\n\n5233286 1/2-INSBX3/8-INSTRSTPXHR ( 12.81\n13.48 DISCOUNT EACH -0.67\n\n6267498 ASD HS EL CH 1.28-GPF (-3 141.55\n149.00 DISCOUNT EACH -1.45\n\n107204 LCC SYSTEM USE ONLY 0.00\n\nSUBTOTAL: 161.09\n\nTOTAL TAX: 3.66\n\nINVOICE 91593 TOTAL: 170.75\n\nMLRCC: 170.75\n\nTOTAL SAVINGS His TRIP: 5. a\n\nMLRCC: XXXXXXXXXXXXXXKK7796 AMOUNT: 170.75 RUTHCD: 001166\nSUIPED REFID:915930 08/05/25 19:16:19\n\nSTORE: 2412 TERMINAL: 41 08/05/25 19:16:25\n# OF ITEMS PURCHASED: 3\nEXCLUDES FEES, SERVICES AND SPECIAL ORDER ITEMS\n\nHwAall ran SnaanTUe 1 uc eS\n";
    static final String HOME_DEPOT_RECEIPT_DATA = "How doers N get more done. 41 SPRING ST. WILKES-BARRE, PA 18702 STR MGR - HENRY ELMY 570-820-5901 4122 00061 38846 08/06/25 07:33 PM SALE SELF CHECKOUT 0266131360%9 BC3/8FIP1/4A <A= 10.40 BC3/8\"FIP X3/8\"0D 1/4TURN ANGLE VALV 026613966373 SUPPLY LINE <A> 1.56 3/8\"0DX7/8\"BCX20\" BRAID TLT SUP LINE SUBTOTAL 17.96 SALES TAX 1.07 TOTAL $19.03 KAKKKKKKKXNK 7424 MASTERCARD USD$ 19.03 AUTH CODE 13613P/3611045 TA Contactless AID AOO00000041010 Mastercard “alz22 0 ifn oy il RETURN POLICY DEFINITIONS POLICY ID DAYS ~ POLICY EXPIRES ON A { 90 11/04/2025 ";

    /*@Ignore
    @Test
    public void testLowes() {
        var data = new ReceiptData(LOWES_RECEIPT_DATA);
        assertEquals(170.75, data.getAmount());
        assertEquals("Lowe's", data.getMerchant());
        assertEquals(LocalDate.of(2025, 8, 5), data.getDate());
    }

    @Test
    public void testHomeDepot() {
        var data = new ReceiptData(HOME_DEPOT_RECEIPT_DATA);
        assertEquals(19.03, data.getAmount());
        assertEquals("Home Depot", data.getMerchant());
        assertEquals(LocalDate.of(2025, 8, 6), data.getDate());
        //todo this will fail once 11/04/25 is closer to the current date than 8/6/25. Change the expected date to 11/04/25 at that point
    }
*/
}
