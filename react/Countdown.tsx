import React, { useState } from 'react';
import { TimeSplit } from './typings/global';
import { tick } from './utils/time';
import { useCssHandles } from 'vtex.css-handles';
import { useQuery } from 'react-apollo';
import useProduct from 'vtex.product-context/useProduct';
import productReleaseDate from './queries/productReleaseDate.graphql';

const DEFAULT_TARGET_DATE = (new Date('2020-09-25')).toISOString();
const CSS_HANDLES = ['countdown'];

interface CountdownProps {
  targetDate: string
}

const Countdown: StorefrontFunctionComponent<CountdownProps> = ({ }) => {

  const [timeRemaining, setTime] = useState<TimeSplit>({
    hours: '00',
    minutes: '00',
    seconds: '00'
  })

  const { product: { linkText } } = useProduct();
  const { data, loading, error} = useQuery(productReleaseDate, {
    variables: {
      slug: linkText
    },
    ssr: false
  })

  const handles = useCssHandles(CSS_HANDLES);

  tick(data?.product?.releaseDate || DEFAULT_TARGET_DATE, setTime)

  if (loading) {
    return (
      <div>
        <span>Loading...</span>
      </div>
    )
  }
  if (error) {
    return (
      <div>
        <span>Erro!</span>
      </div>
    )
  }
  if (!data) {
    return (
      <div>
        <span>Não há contexto de produto</span>
      </div>
    )
  }

  return (
    <div className={`${handles.countdown} db tc`}>
      <h1>{`${timeRemaining.hours}:${timeRemaining.minutes}:${timeRemaining.seconds}`}</h1>
    </div>
  )
}

Countdown.schema = {
  title: 'editor.countdown.title',
  description: 'editor.countdown.description',
  type: 'object',
  properties: {
    targetDate: {
      title: 'Data final',
      description: 'Data final utilizada no contador',
      type: 'string',
      default: null,
    },
  },
}

export default Countdown
