# Vercel V2Box Config API

یک API ساده برای تولید کانفیگ JSON، لینک `vless://` و لینک اشتراک (`subscription`) برای استفاده در کلاینت‌هایی مثل v2box.

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
- `http://localhost:3000/api/sub`

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
- `format` (برای `/api/v2box`: `uri` یا `json`، پیش‌فرض هر دو)
- `token` (اگر `API_TOKEN` فعال باشد)

## 4) لینک اشتراک برای موبایل (`/api/sub`)

برای داشتن خروجی ساده‌ی `text/plain` که مستقیم در کلاینت وارد شود:

```text
https://your-project.vercel.app/api/sub?host=your-server.com&uuid=11111111-2222-3333-4444-555555555555&pbk=YOUR_REALITY_PUBLIC_KEY&sid=abcd&sni=your-server.com&fp=chrome&spx=%2F&remark=my-vpn
```

## 5) امنیت API با توکن (پیشنهادی)

در Vercel یک Environment Variable با نام `API_TOKEN` تعریف کن.  
از این به بعد API فقط وقتی پاسخ می‌دهد که توکن درست ارسال شود:

- Query: `&token=YOUR_TOKEN`
- Header: `x-api-key: YOUR_TOKEN`

## 6) استفاده در v2box

API خروجی زیر را برمی‌گرداند:
- `vlessUri`: لینک آماده ایمپورت
- `config`: کانفیگ JSON قابل استفاده

می‌تونی در v2box لینک `vlessUri` را Import کنی یا JSON را دستی Paste کنی.

## 7) حالت خیلی ساده: یک لینک ثابت (`/api/quick`)

اگر نمی‌خوای هر بار فرم پر کنی، این endpoint را استفاده کن:

```text
https://your-project.vercel.app/api/quick
```

این endpoint از Environment Variables می‌خواند و یک `vless://` آماده برمی‌گرداند.

### envهای لازم (حداقل)
- `VPN_HOST` (مثال: `your-server.com`)
- `VPN_UUID` (UUID کاربر)

### envهای اختیاری
- `VPN_MODE` (`tls` یا `reality`) - پیش‌فرض: `tls`
- `VPN_PORT` - پیش‌فرض: `443`
- `VPN_SNI` - پیش‌فرض: `VPN_HOST`
- `VPN_REMARK` - پیش‌فرض: `my-vpn`

### اگر `VPN_MODE=reality`
- `VPN_PBK` (اجباری)
- `VPN_FP` (پیش‌فرض: `chrome`)
- `VPN_SID` (اختیاری)
- `VPN_SPX` (پیش‌فرض: `/`)

### امنیت
اگر `API_TOKEN` فعال باشد:
- از `https://your-project.vercel.app/api/quick?token=YOUR_TOKEN` استفاده کن

## نکته مهم

این پروژه «سرور VPN» نیست؛ صرفا «ژنراتور کانفیگ» است.  
خود سرور VLESS+Reality باید از قبل روی VPS تو نصب و فعال باشد.
