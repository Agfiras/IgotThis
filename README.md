# validate-csv-cli

A Node.js CLI tool to validate email, birthday, and passport fields from a CSV file.

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

## Usage

```bash
node validate-csv.js <path-to-csv>
```

- The CSV file must have columns: `email`, `birthday`, `passport`
- Example:

```
email,birthday,passport
user1@example.com,1990-05-21,A1234567
user2@example,1992-13-01,123456
user3@example.com,1985-12-15,AB123456
```

## Output
- For each row, the tool prints whether the row is valid or which fields are invalid.
- At the end, prints `Validation complete.`

## Passport Format
- Alphanumeric, uppercase, 6-9 characters (e.g., `A1234567`, `AB123456`)

## License
MIT 