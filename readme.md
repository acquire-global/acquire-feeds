# Acquire Feeds

The acquire-feeds package enables projects to trigger and run Acquire supplier feeds, including CSV conversion. Use acquire-ftp to upload to FTP if required.

## Installation

Install directly from github, e.g.

    npm i github:acquire-global/acquire-feeds

## Usage

### Import suppliers

#### Import all suppliers

    import suppliers from 'acquire-feeds/suppliers'

#### Import a single supplier

    import supplier from 'acquire-feeds/suppliers/supplier'

### Process the feed(s)

#### Fetch the supplier data

    const supplierProducts = await supplier.getFeed()

#### Map the supplier data to Acquire products

    const mappedSupplierProducts = await supplier.mapFeed(supplierProducts)

#### Convert to CSV

```
import convertToCsv from 'acquire-feeds/csv'

const supplierCsv = convertToCsv(mappedSupplierProducts)
```

#### Upload to FTP

##### First install acquire-ftp package

    npm i github:acquire-global/acquire-ftp

##### Upload to FTP

```
import acquireFtp from 'acquire-ftp

const ftp = acquireFtp.config({
	username: process.env.ACQUIRE_FTP_USERNAME,
	password: process.env.ACQUIRE_FTP_PASSWORD,
})

ftp.uploadFeed({
	contents: supplierCsv,
	filename: `${supplier.country}_${supplier.code}.csv`,
	destination: ftp.FOLDERS.FEEDS_INBOX,
})
```

## Supplier definitions

Suppliers are defined in the [suppliers](src/suppliers) folder.
See [shared.ts](src/suppliers/shared.ts#L14) for the Supplier class definition.

In addition to a name and code, each supplier needs a function to fetch its data (e.g. scraper/API) and a function to map its products onto the [AcquireProduct](src/index.ts#L8) interface.
