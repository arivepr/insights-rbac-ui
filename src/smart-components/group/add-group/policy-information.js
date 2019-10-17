import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  FormGroup,
  Stack,
  StackItem,
  Text,
  TextArea,
  TextContent,
  TextInput,
  TextVariants,
  Title
} from '@patternfly/react-core';
import asyncDebounce from '../../../utilities/async-debounce';
import { fetchPolicyByName } from '../../../helpers/policy/policy-helper';

const PolicyInfoText = ({ title, editType }) => {
  return (editType === 'edit') ?
    <TextContent>
      <Text component={ TextVariants.small }> All fields are required </Text>
    </TextContent> :
    <Fragment>
      <StackItem>
        <Title size="xl">{ title }</Title>
      </StackItem>
      <TextContent>
        <Text component={ TextVariants.h6 }>Policies are the permissions set for this group.
        Groups can have one or more policies.
        Policies are created for a group, they cannot be shared.
        You can only create one policy at this time.
        It is possible to create more for this group at a later time.<br/>
        All fields are optional.</Text>
      </TextContent>
    </Fragment>;
};

PolicyInfoText.propTypes = {
  title: PropTypes.string,
  editType: PropTypes.string
};

const PolicyInformation = ({ title, editType, formData, onHandleChange }) => {
  const [ error, setError ] = useState(undefined);
  const policy = formData.policy ? formData.policy : { name: '', description: '' };

  const validateName = (name) => fetchPolicyByName(name)
  .then(({ data }) => {
    console.log('Debug 1: data, name', data, name);
    if (!name || name.trim().length === 0) {
      return 'Required';
    }

    console.log('Debug 4: name', name);
    return data.find(pol => name === pol.name)
      ? 'Name has already been taken'
      : undefined;
  });

  const debouncedValidator = (data) => asyncDebounce(validateName(data.policy.name));

  const handleNameChange = (data) => {
    validateName(data.policy.name).then((res) => {
      console.log('Debug 5: result, res, one', res, data.policy.name);
      setError(res);});
    onHandleChange(data);
  };

  return (
    <Fragment>
      <Form>
        <Stack gutter="md">
          <StackItem>
            <PolicyInfoText title= { title } editType = { editType }/>
          </StackItem>
          <StackItem>
            <FormGroup
              label="Name"
              fieldId="policy-name"
              isValid={ !error }
              helperTextInvalid={ error }
            >
              <TextInput
                isRequired
                type="text"
                id="policy-name"
                name="policy-name"
                aria-describedby="policy-name"
                value={ policy.name }
                onChange={ (_, event) => handleNameChange({ policy: { ...policy, name: event.currentTarget.value }}) }
              />
            </FormGroup>
          </StackItem>
          <StackItem>
            <FormGroup label="Description" fieldId="policy-description">
              <TextArea
                type="text"
                id="policy-description"
                name="policy-description"
                value={ policy.description }
                onChange={ (_, event) => onHandleChange({ policy: { ...policy, description: event.currentTarget.value }}) }
              />
            </FormGroup>
          </StackItem>
        </Stack>
      </Form>
    </Fragment>
  );
};

PolicyInformation.propTypes = {
  formData: PropTypes.object,
  editType: PropTypes.string,
  title: PropTypes.string,
  onHandleChange: PropTypes.func.required
};

PolicyInformation.defaultProps = {
  title: 'Create policy',
  editType: 'add'
};

export default PolicyInformation;

