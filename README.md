# Vercel V2Box Config API

یک API ساده برای تولید کانفیگ JSON و لینک `vless://` برای استفاده در کلاینت‌هایی مثل v2box.

## 1) اجرا در حالت لوکال

```bash
npm i -g vercel
vercel dev
```

بعد از اجرا:
- `http://localhost:3000/` (فرم ساده ساخت و تست کانفیگ)
- `http://localhost:3000/api/health`
- `http://localhost:3000/api`
- `http://localhost:3000/api/params`

## 2) دیپلوی روی Vercel

```bash
vercel
```

در پایان یک دامنه بهت می‌دهد مثل:
`https://your-project.vercel.app`

بعد از دیپلوی هم می‌تونی با فرم آماده کار کنی:
- `https://your-project.vercel.app/`

## 3) ساخت کانفیگ v2box

نمونه:

```text
https://your-project.vercel.app/api/v2box?host=your-server.com&uuid=11111111-2222-3333-4444-555555555555&pbk=YOUR_REALITY_PUBLIC_KEY&sid=abcd&sni=your-server.com&fp=chrome&spx=%2F&remark=my-vpn
```

### پارامترهای اجباری
- `host`
- `uuid`
- `pbk` (Reality public key)

### پارامترهای اختیاری
- `port` (پیش‌فرض: `443`)
- `sni` (پیش‌فرض: مقدار `host`)
- `fp` (پیش‌فرض: `chrome`)
- `sid` (short id)
- `spx` (spider x، پیش‌فرض: `/`)
- `remark` (نام پروفایل)

## 4) استفاده در v2box

API خروجی زیر را برمی‌گرداند:
- `vlessUri`: لینک آماده ایمپورت
- `config`: کانفیگ JSON قابل استفاده

می‌تونی در v2box لینک `vlessUri` را Import کنی یا JSON را دستی Paste کنی.

## نکته مهم

این پروژه «سرور VPN» نیست؛ صرفا «ژنراتور کانفیگ» است.  
خود سرور VLESS+Reality باید از قبل روی VPS تو نصب و فعال باشد.
