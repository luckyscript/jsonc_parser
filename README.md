# JSON_with_comments_Parser

## use

```
npm install json_with_comments_parser

import { parse } from 'json_with_comments_parser'

parse('{"a": "b"}')
```

## examples

parse(`{
            "a":"b" //comment
        }`)

// [{"key":"a","children":[],"value":"b","type":"String","comment":"comment"}]

## TODO:
1. parser ArrayLike json [doing]
2. comment parser bugs fix [finish]
3. support mutiline comments [finish]
