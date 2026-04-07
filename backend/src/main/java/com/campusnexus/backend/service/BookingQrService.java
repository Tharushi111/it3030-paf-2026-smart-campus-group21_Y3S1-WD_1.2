package com.campusnexus.backend.service;

import com.campusnexus.backend.model.Booking;
import com.campusnexus.backend.model.BookingStatus;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class BookingQrService {

    public byte[] generateApprovedBookingQr(Booking booking) {
        if (booking.getStatus() != BookingStatus.APPROVED) {
            throw new IllegalArgumentException("QR code is available only for approved bookings");
        }

        try {
            String qrContent = """
                    BOOKING_ID:%d
                    USER:%s
                    RESOURCE_ID:%d
                    DATE:%s
                    START:%s
                    END:%s
                    STATUS:%s
                    """.formatted(
                    booking.getId(),
                    booking.getUserEmail(),
                    booking.getResourceId(),
                    booking.getDate(),
                    booking.getStartTime(),
                    booking.getEndTime(),
                    booking.getStatus()
            );

            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            var bitMatrix = qrCodeWriter.encode(qrContent, BarcodeFormat.QR_CODE, 300, 300);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
            return outputStream.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate QR code", e);
        }
    }
}