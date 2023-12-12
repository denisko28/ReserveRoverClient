import { Button, TextInput } from 'flowbite-react'
import { FC } from 'react'
import styles from './search-input.module.scss';

type SearchInputProps = {
    placeholder?: string;
    className?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: () => void;
}

const SearchInput: FC<SearchInputProps> = (props) => {
    return (
        <div className={`block ${styles["search-input"]} w-full ${props.className}`}>
            <TextInput
                id='search'
                type='text'
                placeholder={ props.placeholder ?? 'Введіть назву закладу...'}
                sizing='md'
                onChange={(e) => props.onChange(e)}
            />
            <Button color="primary" onClick={props.onSubmit}>Пошук</Button>
        </div>
    )
}

export default SearchInput;
