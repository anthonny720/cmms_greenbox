import React, {useEffect, useState} from 'react';
import Layout from "../../hocs/Layout";
import Filter from "../../components/Assets/Filter";
import {faLocationDot, faTools, faTruck} from "@fortawesome/free-solid-svg-icons";
import {Disclosure, Transition} from "@headlessui/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {MinusIcon, PlusIcon} from "@heroicons/react/20/solid";
import {MapPinIcon, WrenchScrewdriverIcon} from "@heroicons/react/24/outline";
import {useDispatch, useSelector} from "react-redux";
import {get_tree} from "../../redux/actions/assets";
import {map} from "lodash";
import Modal from "../../components/util/Modal";
import FormFacilities from "../../components/Assets/FormFacilities";
import FormTools from "../../components/Assets/FormTools";
import FormEquipments from "../../components/Assets/FormEquipments";
import ModalHook from "../../components/util/hooks";
import ButtonAdd from "../../components/util/ButtonAdd";
import Header from "../../components/navigation/Header";

const Assets = () => {
    /*Modal*/
    const {content, setContent, isOpen, setIsOpen, openModal} = ModalHook();

    const dispatch = useDispatch()
    const tree = useSelector(state => state.Assets.tree)
    let [isOpenPage, setIsOpenPage] = useState(true)


    const handleAddFacilities = () => {
        setIsOpen(true)
        setContent(<FormFacilities close={openModal}/>)
    }
    const handleAddTool = () => {
        setIsOpen(true)
        setContent(<FormTools close={openModal}/>)
    }

    const handleAddEquipments = () => {
        setIsOpenPage(false)
        setContent(<FormEquipments close={ChangePage}/>)
    }

    const ChangePage = () => {
        setIsOpenPage((prev) => !prev)

    }

    useEffect(() => {
        dispatch(get_tree())
    }, []);

    return (<Layout>
        {isOpenPage && <ButtonAdd>
            <button onClick={() => handleAddFacilities()} type={"button"}
                    className={"text-xs space-4 bg-white rounded-full mt-2   flex items-center p-2 justify-around font-light hover:bg-opacity-10 hover:rounded-full hover:bg-[#5f9cf4]"}>

                <FontAwesomeIcon className={"text-gray-400  "}
                                 size={"lg"} icon={faLocationDot}/>
            </button>
            <button onClick={() => {
                ChangePage()
                handleAddEquipments()
            }} type={"button"}
                    className={"text-xs space-x-4 bg-white rounded-full mt-2   flex items-center p-2 justify-around font-light hover:bg-opacity-10 hover:rounded-full hover:bg-[#5f9cf4]"}>

                <FontAwesomeIcon className={"text-gray-400 "}
                                 size={"lg"} icon={faTruck}/>
            </button>
            <button onClick={() => handleAddTool()} type={"button"}
                    className={"text-xs space-x-4 bg-white rounded-full  mt-2  flex items-center p-2 justify-around font-light hover:bg-opacity-10 hover:rounded-full hover:bg-[#5f9cf4]"}>

                <FontAwesomeIcon className={"text-gray-400 "}
                                 size={"lg"} icon={faTools}/>
            </button>
        </ButtonAdd>

        }

        <Modal isOpen={isOpen} close={openModal} children={content}/>
        {isOpenPage ? <div className={"h-full overflow-y-auto scrollbar-hide w-full bg-white p-4 rounded-l-2xl"}>
            <Header/>
            <Filter/>
            {tree && tree !== null && map(tree, i => {
                return <Disclosure as="div">
                    {({open}) => (<>
                        <Disclosure.Button
                            className="flex w-full mt-4 justify-start gap-2 border-b-2  items-center  bg-white px-4 py-2 text-left text-sm font-medium text-black hover:bg-blue-600 hover:bg-opacity-10 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                            {i?.children?.length > 0 && !open ? <PlusIcon
                                    className={"h-6 w-6 bg-gray-400 text-blue-400  bg-opacity-20 rounded-full hover:bg-white "}/> :

                                <MinusIcon
                                    className={` h-6 w-6 bg-gray-400 text-blue-400  bg-opacity-20 rounded-full hover:bg-white`}/>}
                            <MapPinIcon
                                className={`h-5 w-5 text-blue-500 `}
                            />
                            <p>
                                <span className={"font-normal font-sans text-xs"}>{i?.name}</span>
                                <br/>
                                <span
                                    className={"font-normal text-gray-400 font-sans text-[10px]"}>{"// GREENBOX/"}</span>
                            </p>

                        </Disclosure.Button>
                        <Transition
                            show={open}
                            enter="transition duration-100 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-75 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                        >
                            {map(i?.children, j => {
                                return <Disclosure.Panel
                                    className="flex w-full   justify-start gap-2 border-b-2  items-center  bg-white pl-16  py-2 text-left text-sm font-medium text-black hover:bg-blue-600 hover:bg-opacity-10 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                                    <WrenchScrewdriverIcon
                                        className={`h-5 w-5 text-blue-500 `}
                                    />
                                    <p>
                                        <span className={"font-normal font-sans text-xs"}>{j.name}</span>
                                        <br/>
                                        <span
                                            className={"font-normal text-gray-400 font-sans text-[10px]"}>{"// GREENBOX/ "}{i?.name}/</span>
                                    </p>
                                </Disclosure.Panel>
                            })}

                        </Transition>
                    </>)}
                </Disclosure>
            })}


        </div> : content}

    </Layout>);
};

export default Assets;
