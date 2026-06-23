const fs = require('fs');
const http = require('http');
const https = require('https');

async function checkUrl(url) {
  return new Promise((resolve) => {
    const req = url.startsWith('https') ? https.request(url, { method: 'HEAD' }) : http.request(url, { method: 'HEAD' });
    req.on('response', (res) => {
      resolve(res.statusCode === 200 || res.statusCode === 302 || res.statusCode === 304);
    });
    req.on('error', () => resolve(false));
    req.end();
  });
}

const urls = [
  'https://lh3.googleusercontent.com/aida/AP1WRLvegd-EpWkXIti3zRNdKgNfwAltfxc3ychNT10yD2orSi8VM7V4o5m_6lM41LEaze-v1nOYysHX9PuY7h0eNIPrg7s1p8meLvtEg6-dOz3G2DXPZTUmVVHtE7Z7EwUNqM5ZU8EMrxbPvPva_-C3_Pcv8aj5ApB_TKxZZEhyHlW9zqTqHlItW279eNfRTxvCVdapT4G6S7KMTPqccOU6QBaloe5hbSELpm4uw8DWI1dP7e6wX36nyk8qAfs',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD5QVTjugzSOWUYLeUXOszGJ_MScs3RGGDdDnyBT9Yk8Ktqy6fcmWis2NgoOU0uCpP02t9KPDzTbBoituE6fkD13d85Vq9PABQkdcOra1lr1LA-uHIulnKRQiT2p1RIAMp2le71Ax-eRI0Rl1d7D_j_8ygmZ5NQ0wY6P45wJ78jrFjpaUnJcBc0rphxKRpHCfxKz-ALvPNVvSrXE3BKTV9SvhQOdqTawq1F1VpZewwSv6mgWa9nhhrzAjnEaLTYffmfOoknLk7jjGE',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDXUa81LqyG6kcXtbpBD46M8shTj5XLyyvqtPRiVGR-CPCK4j7nr6Z9dMEppF3jZdTdY6j74CjhDlCLCRIb8ZMR0ymD9EG6dxY0bXIPQMKVZTwahTwQTk-c7CoRgsc8TFPZ4B5l5v1b8Xj7GZ91JSL-Ka4qveKpRrz9-KSCBCmKMV-gJt8W4ZpuJMwPeLn1D0xWMfFWXXwpI4W08g7jzNac0B1Pdo7pP5yVCH0k9NBbhBjaoac1JCPq5ACNfYqPWELK-8prW833F-E',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuATjn9cmZuuoX3v_bmbGupGOEFcjHDTnEU-uHxNS2kbUEUkWr08rAIXMqT4hHwNMkDSErvvzvIl5eFAcSqPuYn1cBoqlAdoBCIVvdNcXnbMmvfuRrr1qfbX-1qhs-LQHdNPBn84q6pryf0BIB1WCUlsNtyLQ9iBjDtNQC4JYXbrtBUoRxSCEMqibViTdKlWNTwYfACTPyQlBqGCxTpxEgSVAo8SeXixrZfpSA0dlxdr1wiS9mYuWMTpWnOVflH5Z08jWrrZ75YfDas',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDgt0AlzwqWyDIE-rgYdIrptEW5EEw2cNajB5_KgqkhnDaElBLfXtbsK6X64Vfk8WS1a2vDcsbPWigyXO7iWnxUwKYWfWOasuA9QiQxM3XQE8KM0e9xayRFI18GURXpC2fyP0YHpaza0jFDi_bEw-DkbmNFvzRqQ1zexWDsih0HmLYLyEkfLUMDoK1qX9wYL8aRH5Urxi6R3Pgs7ObzlceqY5Z-rdkTKgRdsbYCvwBMsBoS8rICGRpyc1cPJRm3sIhNuxO-xt4KH40',
  'https://lh3.googleusercontent.com/aida/AP1WRLvbzt_GWWIrXsDsv_0w9ARc_MRKtiCSAqdPE0cfLrcOvTDjpQQiyoDFL6FI3okqRTASEPwcI48RY69zW6y1LdIUXoiWVwrV72s-r0V6TYBjVUek67nU-025FUJ5sWwIXVm-wniOyLp7TFI4azYVgQiVxYo9FiWXs_GGZKl-RGRkeRLOp8Uq1Fpq8xnTLAkZNACVD_-A53uXdXm4Q8Y1izeJXSqb310jsz_31EZS_jJvCtW_DgQ4whu1rok',
  'https://lh3.googleusercontent.com/aida/AP1WRLuwCvhZXy78hi6-7Qi9HXge4ltV--V6tJm3Us_kL8HUNGL__0aUDvFtu2KL7mAItKU7RQrXciy2jAWnVuJvgQ5LIxthF_5BUjmgkfVKBjnVOc3jIaAtuyi4D7PeFXq_mPzIiHpLxj0hVxuXE4ob9qm4hbAvFaJqOrm4eYmNsdSY2W8-QEI4jZccJWXVk3j0zJuKc8XIK34lqqSWoSckoUOtkOE_7WioWgH9nwadKL39-2O6bd_PbkId6kg',
  'https://lh3.googleusercontent.com/aida/AP1WRLs_YbsONY_A1XRblmF74uBnbB-Ew1lPQqEmtOES7XoMX0qAljGlpKqvArpS9r8wZnYia8DpbbFT3xMhtPQE4zNk-HALz6D41tO3KdLA6FB4BwUnbTXhfCz9TmFczzuEUCOf7X9BKzU8GdyxJ0LPL8WctbEmhQrCyuLR3KU58qZJh6XLB6QMaSy_DnOB8kWsaRBo02TAofUKu-gqakMYoQvSg0j59hJkpsbWfoCeZguW0dE6h_g3maxZiw',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC7TeVxfKMboizcVfG9FtVI6mIkbFat9OWMv5kR70eNjoAc7TeK58I8leMk6PreWStt5IuWONDBB0HFAoFzQLFkmYrL3Gk-gIEGDqcY9pPKUeULoxoNkVOm3nb_nQBwr8C42BYoBN_F-zhFc88QHOZH4sOJE22BW046OOo5qtOgB7WUx4eLI5XfyNXWHKTVFFCoZ66afn2yupUDmZY0BrVf_UNc-BPFavcRDIQmB2Tu9NfBJ-P1sOTu0lvA1oKErAr1tENEbYA-8Nk',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBKvhDxhb2iPmYfPTSkXTqrCW0JA7e0CpZlrz3NndZQH8j4NYXX_uKF9ABmEobrIhGkhqVQHVpmdy4BJLmSnja0-t_q178mKAQ-YDNMjo3e3FSYZ2tW8nZcnVVO2uTFdDwiSemQ_rLRhRfWtmw0T2wkVRqyBXudyLhmnVfzqLnoXUPYf3YkVTxDQ96_rI7ZwN6W4LyESn82QqSTFQiwhPZXTVl6GADPWdJcCUems8NKX0_Fiy3_WveuUF1i7BzboEmPa65rmgdxcfU',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDThua3769ZdSLAAyew3m2yZ_JflHzAbel0nt_kEYjuhQHN5qM5U-UbGj1fhDvnh4dLw851bXxKebG3Wy1zQ9oxuAvmFGmDH0ullM90Cv43Nxc2V4cezhSNTY1kGr7Ecjakjzu1L88PVmsR6jsxdocT4D5QxjJrOmwu3FVVYZZSpsNvYKNX068TBCbvFbqw_an-YYH77_T7Uj2P2DD0DSGMvOGM9dOKb1sweraTFZj2lvAiOj6MczANBxMIdwQ2Pk4Ah_6JlofpK0Y',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDZEsZyB6FclpAjkTAibWBMZTKHLRW96EKOYnaEv03SQeP5TrDRSOknYQYhS2S1MxEaxoO2Qiw0WR_EBwilZ2IE9N6x9BPqrxgCXT0n3nJsSdWi193euA7PBDVbFdQvOFN_9hgduNoBKhnbNnCY_2K-wA6XpOEuQX2ca10SRtr4fcJDJ9pm5K3KaEMaMWdAY3PX0lFxGp-6x671B76Txp32qU01v3VxR_9hEWHP092vmApPsxgC_IkDtUoN200KoV-EWtamQiaNOyo',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCsxx2jsQxOLS6u7CcW1FeeOLbTUL6liIbqczzVKIOYPADHF1zM5Yo2JFIzN_ztKOeMF4ZjRtpV5sckBq_fpHGN7eO_8XsBpi1BPtWPr14w-_SI1EUigvMt8bhYp_klpnGY6E1WnqCnpdM8SMyBWeHgazZekaXExVIJmMrTeD0IfsreP4_2XpR91MYDQSWFNZ_SKZaWHyKdFWAioYiY8-6kucm1IlHHp6H1WopAEGYdMxfFtMZpcX5qYS63PhuZtKz_ztYbrm8MnPc'
];

async function run() {
  for (const url of urls) {
    const ok = await checkUrl(url);
    console.log(`${ok ? 'OK' : 'BROKEN'} - ${url.substring(0, 50)}...`);
  }
}
run();
