import { FC } from 'react'
import { HiOutlineDocumentSearch } from 'react-icons/hi';

const NotModeratedYet: FC = function () {
    return (
        <div className='h-96 flex flex-col gap-3 justify-center items-center'>
            <HiOutlineDocumentSearch className='text-gray-500 w-1/5' style={{ height: 100 }} />
            <div className="text-center">
                <h3 className='font-bold text-2xl mb-2'>Ваш заклад очікує на модерацію...</h3>
                <p className='text-gray-500 font-medium'>Як правило, модерація займає до 3 годин.</p>
            </div>
        </div>
    )
}

export default NotModeratedYet;
