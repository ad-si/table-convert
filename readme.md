# Table Convert

CLI tool to convert HTML tables to Multimarkdown or LaTeX.


## Installation

```sh
npm install --global table-convert
```


## Usage

Print a Multimarkdown table to stdout:

```sh
table-convert table.html
# or
table-convert --to markdown table.html
```

Print a LaTeX table to stdout:

```sh
table-convert --to latex table.html
```
