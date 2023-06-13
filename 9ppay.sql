SELECT
    T1.ENCIP_SHORT,
    T1.NAME,
    T1.INST_DATE,
    T1.UPDT_DATE,
    T2.MAX_DATE
FROM
    DRRR_ENC_IP_NAMES T1
JOIN
    (
        SELECT
            ENCIP_SHORT,
            MAX(UPDT_DATE) MAX_DATE,
            CASE
                WHEN TIMESTAMPDIFF(SECOND, MAX(UPDT_DATE), NOW()) >= 30 THEN '1'
                ELSE '0'
            END TYPE
        FROM
            DRRR_ENC_IP_NAMES
        GROUP BY
            ENCIP_SHORT
) T2
ON
    T1.ENCIP_SHORT = T2.ENCIP_SHORT
ORDER BY
    TYPE,
    CASE
        WHEN TYPE = '0' THEN T1.ENCIP_SHORT
        ELSE ''
    END,
    T2.MAX_DATE DESC,
    UPDT_DATE DESC
