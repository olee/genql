import { Stack } from 'layout-kit-react'
import React, { useEffect, useState } from 'react'
import { Code } from '@app/components/CodeEditor'
import gql from 'graphql-tag'
import { print } from '@genql/cli/src/printer'
import { useDebouncedCallback } from 'use-debounce'
import { BG } from '../constants'

function Page({}) {
    const [code, setCode] = useState(DEFAULT_QUERY)
    const onCodeChange = useDebouncedCallback(() => {
        setInvalid('')
        try {
            const query = gql(code)
            console.log('parsed')
            setGenqlTranslation('\n' + print(query, {}))
        } catch (e) {
            console.error(e)
            setInvalid('Line ' + e.locations?.[0]?.line + ': ' + e.message)
        }
    }, 400)
    useEffect(() => {
        onCodeChange()
        return
    }, [code])
    const [genqlTranslation, setGenqlTranslation] = useState('')
    const [invalid, setInvalid] = useState('')
    return (
        <div>
            <div className=''></div>

            <Stack
                spacing='40px'
                justify='stretch'
                width='100%'
                align={['center', null, null, 'flex-start']}
                direction={['column', null, null, 'row']}
            >
                <div className='flex flex-col gap-4 grow'>
                    <Code value={code} onChange={setCode} />
                    {invalid && (
                        <pre className='text-red-300 text-sm'>{invalid}</pre>
                    )}
                </div>
                <div className='grow'>
                    <Code
                        hideLinesNumbers
                        flex='1'
                        readOnly
                        value={genqlTranslation}
                    />
                </div>
            </Stack>
        </div>
    )
}

export default Page

const DEFAULT_QUERY = `
query {
    getUser(where: { name: { eq: "Tommy" }}) {
        name
        id
        address {
            ...addressFragment
        }
    }
}

fragment addressFragment on Character {
    city
    code
    state
}
`
