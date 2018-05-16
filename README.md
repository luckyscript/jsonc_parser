# JSON_with_comments_Parser

## use

```sh
npm install json_with_comments_parser

import { parse } from 'json_with_comments_parser'

parse('{"a": "b"}')
```

## examples
```js
parse(`{
            "a":"b" //comment
        }`)

// [{"key":"a","children":[],"value":"b","type":"String","comment":"comment"}]
```

## TODO:
1. parser ArrayLike json [finish]
2. comment parser bugs fix [finish]
3. support mutiline comments [finish]

## Q:
1. How to take difference for ArrayLike JSON and Object like json
2. String does not support unicode chars

# LICENSE

---

The MIT License (MIT)

Copyright (c) 2015 Kay Lu <main.lukai@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

