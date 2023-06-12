import { Button } from 'flowbite-react';
import { FC } from 'react'
import { HiOutlineOfficeBuilding } from 'react-icons/hi';

const NoPlaceYet: FC<{onClick?: () => void}> = function ({onClick}) {
    return (
        <div className='h-96 flex flex-col gap-3 justify-center items-center'>
            <HiOutlineOfficeBuilding className='text-gray-500 w-1/5' style={{ height: 100 }} />
            <div className="text-center">
                <h3 className='font-bold text-2xl mb-2'>У вас ще немає закладу...</h3>
                <p className='text-gray-500 font-medium'>Натисніть на кнопку щоб перейти до створеня</p>
            </div>
            <Button color="primary" size="sm" className='w-64 mt-3' onClick={onClick}>
                Створити заклад
            </Button>
        </div>
    )
}

export default NoPlaceYet;
